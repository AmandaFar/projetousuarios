// para formatar a data em uma view e validacoes

class Utils {

    //metodo static nao precisa criar instancia da classe
    static dateFormat (date){

        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();
    }

}