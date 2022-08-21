module.exports = {
  getIndex: (req,res)=>{
      res.render('index.ejs', {row: 160, col: 160})
  }
}