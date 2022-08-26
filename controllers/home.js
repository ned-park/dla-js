module.exports = {
  getIndex: (req,res)=>{
      res.render('index.ejs', {row: 20, col: 20})
  }
}