let director = {
    firstName: "Mario",
    lastName: "Rossi",
  }
  
  let movie = {
    title: "Il film 2",
    director: director,
    year: 2002,
    describe : function(){
      console.log(this.title, this.director.firstName, this.director.lastName, this.year);
    }
  }
  movie.isPartOfaSaga = true;
  movie.describe();
  
  function Movie(title, dir_firtName, dir_lastName, year, isPartOfaSaga){
    this.title = title;
    this.director.firstName = dir_firtName
    this.director.lastName = dir_lastName;
    this.year = year;
    this.isPartOfaSaga = isPartOfaSaga;
  }
  
  