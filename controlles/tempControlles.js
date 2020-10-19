const modelTemp=require('../models/Modeltemp')
exports.ObtenerDatos=async (req,res)=>{
try {
console.log(req)
   const ver=await modelTemp.find()
   res.json({ver})
    
} catch (error) {
    console.log(error);
   
}



}

//obtiene todos 