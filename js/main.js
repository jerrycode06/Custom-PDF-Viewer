const url = '../docs/book.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumisPending = null;

const scale = 1.5,
    canvas = document.getElementById('pdf-render'),
    ctx = canvas.getContext('2d');

//Render The Page
const renderPage = num => {
    pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumisPending !== null) {
        renderPage(pageNumisPending);
        pageNumisPending = null;
      }
    });

    // Output current page
    document.querySelector('#page-num').textContent = num;
  });
}

// Check For Pages Rendering
const queueRenderPage = num => {
    if(pageIsRendering){
        pageNumisPending = num;
    }else{
        renderPage(num);
    }
}

//Show Prevoious Page
const showPreviousPage = () => {
    if(pageNum <= 1){
        return;
    }else{
        pageNum-- ;
        queueRenderPage(pageNum);
    }
}

//Show Next Pages
const showNextPage = () => {
    if(pageNum >= pdfDoc.numPages){
        return;
    }else{
        pageNum++ ;
        queueRenderPage(pageNum);
    }
}

//Get the Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    // console.log(pdfDoc);
    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
})
.catch(err => {
    //Catch The Errors
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div,canvas);
    //Remove The Top Bar
    document.querySelector('.top-bar').style.display = 'none';
});


// Button Events
document.querySelector('#prev-page').addEventListener('click',showPreviousPage);
document.querySelector('#next-page').addEventListener('click',showNextPage);