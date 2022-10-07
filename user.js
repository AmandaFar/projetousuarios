class User {
        //criar e inicializar o objeto
    constructor(name, gender, birth, country, email, password, photo, admin ){

        //o anderline eh pra informar q o acesso eh privado
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        //qdo cria o novo modele, cria essa data
        this._register = new Date();
    }

    //para tornar publico e retorna a propriedade
    //Nao eh uma regra, apenas uma Convensao, uma boa pratica
    // o get para ter acesso sem o anderlane

    get id() {

        return this._id;
    }

    get register(){

        return this._register;
    }
    get name(){

        return this._name;
    }

    get gender(){

        return this._gender;
    }

    get birth(){

        return this._birth;
    }

    get country(){

        return this._country;
    }

    get email(){

        return this._email;
    }

    get password(){

        return this._password;
    }


    get photo(){

        return this._photo;
    }

    get admin(){

        return this._admin;
    }

    // a diferenca do get para o set, eh q no set eh necessario passar um parametro
    // aqui pode especifica alguma regra, tamanho...etc
    set photo(value){

        this._photo = value;

    }
    //carregar o objeto
    loadFromJSON(json){

        //para cada nome encontrado no json faça
        for (let name in json){


            switch(name){

                //para a data
                case '_register':
                    this[name] = new Date(json[name]);
                break;
                //para todos os outros
                default:
                    this[name] = json[name];

            }

        }
    }
    //metodo estatico, so retorna quais sao os usuarios q estao localStorage
    static getUsersStorage(){
        //cria o array objetos JSON
        let users = [];

        //verificar se ha dados no storage
        //sessionStorage.getItem -> permite gravar dados na sessao
        //localStorage.getItem -> permite recuperar dados no localStorage
        if (localStorage.getItem("users")){

            users = JSON.parse(localStorage.getItem("users"));

        }

        return users;
    }

    //metodo para criar novo id
    //com acesso global, para isso usamos a window
    getNewID(){

        //verificar se jah estah guardado no localStorage
        //"userID" guarda o ultimo ID gerado
        //localstore eh string, entao usamos o parseInt para transformar em inteiro
        let usersID = parseInt(localStorage.getItem("usersID"));

        //se ele nao eh maior q zero, entao ele nao existe eo userId recebe zero
       if (!usersID > 0) usersID = 0;
        
       //adiciona
       usersID++;

       //guarda o valor do userID, toda vez q for gerado um novo ID
       localStorage.getItem("usersID", usersID);

       //e retorna
       return usersID;

    }

    //vai saber como salvar o usuario no localStorage, como armazenar essa informacao
    save(){
         //chama o metodo getUsersStorage e retorna todos os usuarios q estao no localstorage
         //e cria um array "users"
         let users = User.getUsersStorage();

         //para verificar a chave unica do usuario
         //se o id existir
         if (this.id > 0) {

            //map -> essa funcao localiza uma informacao, mapeia sua
            //posicao, se altera dados, substitui
            //irah mapear o array
            users.map(u=>{

                //verifica se encontrou o id
                if (u._id == this.id){

                    //se verdade, subescreve e coloca tudo no array

                    //Object.assign -> copia atributos de um objeto(s) gerando um novo
                    //mescla do u o que ta vindo do this
                    //mantem o q vem do this
                    Object.assign(u, this);

                }

                return u;

            });

         } else {

                //caso nao, significa q preciso gerar um novo id para esse usuario
                //chama o metodo getNewID
                //o anderlaine para manipular tb as propriedades privadas
                this._id = this.getNewID();

                 //o metodo push adiciona ao final no array
                 users.push(this);

            }
    
            localStorage.setItem("users", JSON.stringify(users));

     }
     //metodo para remover (localstore)
     remove(){

         //chama o metodo getUsersStorage e retorna todos os usuarios q estao no localstorage
         //e cria um array "users"
         let users = User.getUsersStorage();

        //para percorrer no array, nome do usuario no userData e posicao no index
         users.forEach((userData, index) =>{

            //verificar se eh o objeto instanciado
            if (this._id == userData._id){

                //splice -> a posicao no index a ser removida
                users.splice(index, 1);

            }

         });

         localStorage.setItem("users", JSON.stringify(users));
     }
}