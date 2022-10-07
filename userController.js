class UserController {

    constructor (formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        //chamando o metodo no costrutor
        this.onSubmit();
        this.onEdit();
        this.selectAll();

    }
    //tratamento do botao edit/cancelar (qdo cancelar)
    onEdit(){

        //tratamento do evento de clique
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{

            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", event => {

            //nao atualiza a pagina
            event.preventDefault();
        
         //tratamento do botao enviar para desabilitar apos o envio
         let btn = this.formUpdateEl.querySelector("[type=submit]");

         //aqui desativamos o botao
         btn.disabled = true;

         let values = this.getValues(this.formUpdateEl);

         let index = this.formUpdateEl.dataset.trIndex;

         let tr = this.tableEl.rows[index];

         let userOld = JSON.parse(tr.dataset.user);
        
         //copia o valor de atributos de um objeto
         //cria um objeto destino, retornando este objeto
         //troca o velho pelo novo valor (photo)
         let result = Object.assign ({}, userOld, values);

         //voltando o formulario
         //this.showPanelCreate();

         //A propriedade "content" retorna o conteudo de um elemento/noh e todos os seus descendentes(nós filhos)
         this.getPhoto(this.formUpdateEl).then(
            (content) => {

             //fazendo a validacao
             if (!values.photo) {
                result._photo = userOld._photo;
             } else {
                result._photo = content;
             }

             let user = new User();

             user.loadFromJSON(result);

             //aqui salva/atualiza as informacoes
             //encontra o registro e atualiza (map)
             user.save();

                //passando os dados do usuario para o tr
                this.getTr(user, tr);

                 this.updateCount();

               //aqui limpa o formulario
                this.formUpdateEl.reset();

               //aqui ativamos o botao
               btn.disabled = false;
                
                //exibicao
                this.showPanelCreate();

            }, 
            (e) => {
                console.error(e)
            }
        );

        });


    }
    //tratamento do evento (qdo enviar)
    onSubmit(){

        this.formEl.addEventListener("submit", event => {

            //nao atualiza a pagina
            event.preventDefault();

            //tratamento do botao enviar para desabilitar apos o envio
            let btn = this.formEl.querySelector("[type=submit]");

            //aqui desativamos o botao
            btn.disabled = true;

            let values = this.getValues(this.formEl);

            //verifica se eh falso antes de ler a foto
            //comportamento de excecao
            if (!values) return false;

            this.getPhoto(this.formEl).then(
                (content) => {

                    values.photo = content;

                    //usuario salva a informacao
                    values.save();

                    this.addLine(values);

                    //aqui limpa o formulario
                    this.formEl.reset();

                    //aqui ativamos o botao
                    btn.disabled = false;

                }, 
                (e) => {
                    console.error(e)
                }
            );
        
        });

    }
     //tratamento da foto
    getPhoto(formEl){

        //promise(assincrona), uma acao vai resolver ou rejeitar
        //o resolve eh qdo eh executado com sucesso
        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item => {

                if (item.name === 'photo') {
                    return item;
                }

            });

            let file = elements[0].files[0];

            //carregar foto
            fileReader.onload = () => {

                resolve(fileReader.result);

            };

            //o reject qdo eh rejeitado, dah erro
            // o (e) qual evento do erro, se d permissao...etc
            fileReader.onerror = (e) => {

                reject(e);

            };

            //tratamento p o caso de nao add foto
            //nesse caso fica uma imagem padrao de fundo cor cinza
            if(file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }

        });

    }

    //(formEl) neste caso eh o que passamos no parametro
    getValues(formEl){

        let user = {};
        let isValid = true;

         //usando o operador spread, expessao para multiplos parametros
        [...formEl.elements].forEach(function(field, index){

             //validacao desses campos no formulario
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

                // se ocorrer o erro parar
                field.parentElement.classList.add("has-error");
                isValid = false

            }

            if (field.name == "gender") {
    
                if (field.checked) {
                    user[field.name] = field.value;
                }
    
            } else if(field.name == "admin") {

                user[field.name] = field.checked;

            } else {
    
                user[field.name] = field.value;
    
            }
    
        });

        if (!isValid) {
            return false;
        }
        //objeto JSON
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );

    }

    //metodo para listar todos os dados q estao no sessionStorage
    selectAll(){

          //chama o metodo getUsersStorage
          //carrega a lista de usuarios
          let users = User.getUsersStorage();

          //forEach para novos dados do usuarios
          users.forEach(dataUser =>{

            let user = new User();

            //carrega dados a partir de um JSON
            user.loadFromJSON(dataUser);

            //adiciona a linha
            this.addLine(user);

          });
          

    }

    //Adiciona uma nova linha na tabela
    addLine(dataUser) {

        // guarda os valores nessa variavel, tr td
        let tr = this.getTr(dataUser);

        //tratamento para add mais de uma linha
        //add tr dentro da tabela
        //appendChild -> eh um comando nativo do JS, nesse codigo ele add a linha no final
        this.tableEl.appendChild(tr);

         //atualiza a informacao qdo for add novo usuario na estatistica
        this.updateCount();

    }

    //refactoring
    //getTr seleciona qual a tr q vamos gerar
    //o comando = null, usado para valor padrao, tornando-o OPCIONAL
    getTr(dataUser, tr = null){

        //recupera ou atribui um valor a um elemento HTML
        //uso do $ para o valoes
        //uso do sinal de crase em vez de aspas simples no tr

        if (tr === null) tr = document.createElement('tr');


        //API web dataset, permite colocar atributo dentro de cada informacao
        // q tenha no HTML, qualquer atributo, usado principalmente em formulario
        // serializacao String JSON, transforma um objto em texto
        tr.dataset.user = JSON.stringify(dataUser);

          //uso do if ternario
          tr.innerHTML = `
              <td><img src="${dataUser.photo}" alt= "User Image" class="img-circle img-sm"></td>
              <td>${dataUser.name}</td>
              <td>${dataUser.email}</td>
              <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
              <td>${Utils.dateFormat(dataUser.register)}</td>
              <td>
                  <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                  <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
              </td>
      `;

        //add os eventos nos botoes
      this.addEventsTr(tr);

      return tr;
    }
    
    addEventsTr(tr){

            //add evento de clique no botao excluir
        tr.querySelector(".btn-delete").addEventListener("click", e=>{

            //confirme -> abre uma janela de confrimacao com ok e cancelar
            if (confirm("Deseja realmente excluir?")){

                let user = new User();

                user.loadFromJSON(JSON.parse(tr.dataset.user));

                //remove do localStorage ou banco de dados s for o caso
                user.remove();

                //caso true, remove um item do array, remove do tr
                tr.remove();

                //apos removido eh necessario atualizar na estatista (qtdade de usuarios)
                this.updateCount();
            }
            
        });

              //add evento de clique no botao edit
        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            //JSON.parse -> interpreta uma string, converte em objeto JSON
            let json = JSON.parse(tr.dataset.user);

           //sectionRowIndex-> comeca em zero, conta a posicao do elemento baseada no total
           this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            //for in -> laco para percorrer os objetos
            for (let name in json) {

                //replace-> funcao nativa->procura o primeiro elemento e substitui
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");


                if (field) {

                //continue -> ignora o restante das instrucoes e avanca
                //ignore tudo pra baixo e continue
                //se o field (campo) for do tipo file passa para o proximo

                 switch (field.type) {
                    case 'file':
                    continue;
                    //interrompe o bloco switch
                    break;

                    //radio e checkbox trabalham diferente no form por isso esse tratamento
                    //radio: gender F ou M
                    case 'radio':
                        field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" +json[name] + "]");
                        field.checked = true;

                    break;

                    //checkbox : adminstrador
                    case 'checkbox':
                        field.checked = json[name];
                    break;

                    //default -> caso nenhuma expressao tenha executado
                    //por ser o ultimo nao precisa de break, n precisa parar
                    default:
                        // se nao atribui o value
                        field.value = json[name];

                }

                //field.value = json[name];
                

             }

             
            
                
        }
            //localiza a classe photo e troca o src (imagem)
            this.formUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();


        });

    }
    //metodo para mostrar o painel
    showPanelCreate(){

        //"none" oculta o formulario; "block" fica visivel
        //aqui mostra o painel create
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }

    showPanelUpdate(){

        //aqui mostra o painel edit
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
        
    }

     //criando o metodo para contar count
    updateCount() {
        //variavel para guardar a qtde de usuarios cadastrados
        let numberUsers = 0;
        //variavel para guardar a qtde de admin cadastrados
        let numberAdmin = 0;

        // usando o spread para colocar cada posicao no array, convertendo para o foreach
        [...this.tableEl.children].forEach(tr => {

            //soma, incrementa usuario
            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            //tratamento para saber se eh um admin
            // com o anderlane chama direto do json
            if (user._admin) numberAdmin++;
        })

        //enviar a informacao para tela
        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;

    }
}
