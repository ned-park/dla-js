module.exports = {
  getIndex: (req,res)=>{
      res.render('index.ejs', {row: 80, col: 80})
  }
}