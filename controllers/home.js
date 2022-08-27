module.exports = {
  getIndex: (req,res)=>{
      res.render('index.ejs', {row: 90, col: 90})
  }
}