import express from 'express';

const route = express.Router();

route.get('/',(req,res)=>{
  res.send('sever is running');
});

export default route;