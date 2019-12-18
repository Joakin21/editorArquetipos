const {app, BrowserWindow} = require('electron') //importamos lo necesario para trabajar ocn electron
const path = require('path')
const url = require('url')

let win; // esta variable tendrá el contenido de nuestra ventana de aplicación

function createWindow () { //aqui procedemos a crear la ventana
  win = new BrowserWindow({width: 800, height: 600}) //definimos un alto y ancho en el que s einicializará nuestra aplicación

  // le pasamos como ruta el archivo index que se genera luego de ocmpilar nuestra aplicación de Angular
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/arquetiposFront/index.html'), //esta es la ruta de nuestro index luego de compilar en Angular
    protocol: 'file:',
    slashes: true
  }))

//esto se dispara cuando cerremos la ventana, igualamos win en null para liberar memoria
  win.on('closed', () => {
    win = null
  })
}

//cuando la aplicación este lista llamamos al metodo que definimos arriba para crear la ventana
app.on('ready', createWindow)


app.on('window-all-closed', () => {
  // process.platform contiene el nombre del sistema operativo (darwin == mac, win32 == windows)
  if (process.platform !== 'darwin') { // con esto le decimos que tenga un proceso natural para una aplicación nativa al momento de cerrar la ventana
    app.quit()
  }
})

//aqui nos aseguramos de que cuando la ventana se active no sea nula, para esto llamamos al metodo que se encarga de crear la ventana
app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})