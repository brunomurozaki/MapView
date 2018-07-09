/*SPTRANS Functions*/

function loginSPTrans(){
    
    var chave = "351cf23405f3af731712cbace009b8966406e073098e80b107a519132a7ba50c";
    var url = "http://api.olhovivo.sptrans.com.br/v2.1/Login/Autenticar?token=" + chave;

    $.ajax({
        url: url,
        crossDomain: true,
        data: form,
        dataType: 'json',
        success: function(data) {
            console.log(data);
        },
        type: 'POST'
    });
}