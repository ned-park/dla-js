module.exports = {
  getIndex: (req,res)=>{
      res.render('index.ejs', {row: 100, col: 100})
  }
}