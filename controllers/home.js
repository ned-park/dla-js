module.exports = {
  getIndex: (req,res)=>{
      res.render('index.ejs', {row: 40, col: 40})
  }
}