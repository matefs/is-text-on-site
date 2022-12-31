import puppeteer from 'puppeteer' 
import express from 'express' 
var port = 3000 || process.env.PORT ;
var app = express();


const IndexHtmlPage = `
<!doctype html>
<html lang="en" data-bs-color-scheme>
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

 

    <!-- Replace the Bootstrap CSS with the
         Bootstrap-Dark Variant CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-dark-5@1.1.3/dist/css/bootstrap-blackbox.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap-dark-5@1.1.3/dist/js/darkmode.min.js"></script>

    <title>Search your text at the site!</title>
  </head>
  <body>

  <div class="container">
            <h1 style="padding-top:100px"> Search your exact text in the specified  site !</h1>
            <h5> ( It render the javascript from the site using puppeteer and locate the text using XPATH) </h5>
<form action="/api">
  <div class="input-group mb-3" >
  <span class="input-group-text" id="basic-addon1">Site</span>
  <input type="text" name="site"  class="form-control" placeholder="Your selected site to search" aria-label="Username" aria-describedby="basic-addon1">
  </div>

  <div class="input-group mb-3" style="padding-top:10px">
  <span class="input-group-text" id="basic-addon1">Texto</span>
  <input type="text"  name="text" class="form-control" placeholder="The exact text you want to search" aria-label="Username" aria-describedby="basic-addon1">
  </div>
    <button class="btn btn-primary" type="submit" >Search</button>
</form>

  </div>

    
  </body>
</html>

`



const umMinutoEmMs = 60000;
const tempoParaAcharPalavra = 5000;
 

const objetoTexto = { 
    FoiEncontrado: false,
     numeroDeVezes: 0 
}


app.get('/', function (req, res) { 
    res.send(IndexHtmlPage);
});




app.get('/api', function (req, res) {

    const palavraEscolhida = req.query.text || '';
    const siteEscolhido = req.query.site || '';

if(palavraEscolhida != '' && siteEscolhido != '' && palavraEscolhida != ' ' && siteEscolhido != ' ' ){
(async () => {
    
    
    function delay(time) {
      return new Promise(function(resolve) { 
          setTimeout(resolve, time)
      });
    }
  
  
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
  
    await page.goto(siteEscolhido,{timeout: umMinutoEmMs}); 
    await delay(1000);
  
       
    // clica na div que está escrito select all 
    
    
    try {
        await page.waitForXPath(`//*[contains(text(),'${palavraEscolhida}')]`, {timeout: tempoParaAcharPalavra})
        const textoSelecionado = await page.$x(`//*[contains(text(),'${palavraEscolhida}')]`)  
        objetoTexto.numeroDeVezes = textoSelecionado.length;
        objetoTexto.FoiEncontrado = true;
        console.log('Texto encontrado !! ')
        console.table(objetoTexto)
        res.send(JSON.stringify(objetoTexto))
      } catch (e) {
        objetoTexto.numeroDeVezes = 0;
        objetoTexto.FoiEncontrado = false;
        console.log('Texto não encontrado !! ' + objetoTexto + " no tempo de " + tempoParaAcharPalavra)
        res.send(JSON.stringify(objetoTexto))     
      }

    
    console.log('Pesquisa Finalizada');
  
    await browser.close();
  
    
  })()
} // fim do if
else {
    res.send('Specify 1 site and 1 text')
}

}); // fim do app.get

  



app.listen(port);
console.log(` App listening on port ${port}`)
