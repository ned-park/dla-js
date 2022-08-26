module.exports = {
  getIndex: (req,res)=>{
      res.render('index.ejs', {row: 70  , col: 70})
  }
}