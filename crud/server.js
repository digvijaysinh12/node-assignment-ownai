const express = require('express')

const app = express();

app.get('/',(req,res)=>{
    res.send(
'Hello I am Digvijaysinh`s page'
    )
     
})
const PORT = 9000
app.listen(PORT,()=>{
    console.log(`app is is running on PORT ${PORT} `)
})