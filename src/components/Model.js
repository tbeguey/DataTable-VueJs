export class Model {
  constructor(url){
    this.data_rows = JSON.parse(http_get(url));
    this.selected_index = 1;
    this.range = 10;
    this.start_index = 1;
    this.end_index = 10;

    this.rows_display = this.data_rows.slice(0, 10);
    this.rows_filtered = this.data_rows;

    this.previous_column = "";
    this.ordering = 1;

    this.search = "";

    this.all_search = [];

    this.checked_rows = [];
  }

  update(){
    this.start_index = this.range * (this.selected_index - 1) + 1;
    this.end_index = this.range * this.selected_index;
    this.rows_display = this.rows_filtered.slice(this.start_index - 1, this.end_index);
  }

  sort(column){
    if(this.previous_column === column)
      this.ordering *= -1;
    else
      this.ordering = 1;

    let _this = this;
    this.rows_filtered.sort(
      function(a, b){
        if(_this.ordering === 1){
          if(a[column] > b[column]) return 1;
          else if(a[column] < b[column]) return -1;
          return 0;
        }
        else{
          if(a[column] > b[column]) return -1;
          else if(a[column] < b[column]) return 1;
          return 0;
        }

      }
    );

    this.rows_display = this.rows_filtered.slice(this.start_index - 1, this.end_index);
    this.previous_column = column;
  }

  filter(){
    let _this = this;
    this.rows_filtered = this.data_rows.filter(
      function(value){
        var find = false;
        Object.values(value).forEach(function(element){
          if(String(element).indexOf(_this.search) !== -1){
            find = true;
          }
        });
        return find;
      }
    );

    this.rows_filtered = this.rows_filtered.filter(
      function(value){
        var find = true;

        _this.all_search.forEach(function(element){
          if(find === true){
            if(value[element["column"]]){
              if(String(value[element["column"]]).indexOf(element["search"]) === -1)
                find = false;
            }
            else
              find = false;
          }

        });

        return find;
      }
    );

    this.rows_display = this.rows_filtered.slice(this.start_index - 1, this.end_index);
  }

  delete_row(id){
    this.data_rows.splice(id, 1);
    this.checked_rows.splice(this.checked_rows.indexOf(id), 1);
    this.filter();
  }

  delete_rows(){
    this.checked_rows_copy = this.checked_rows.slice();
    for(var i=0; i < this.checked_rows_copy.length; i++){
      var item = this.checked_rows_copy[i];
      this.delete_row(item);
    }
  }

}

function http_get(u){
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", u, false);
  xhttp.send(null);
  return xhttp.responseText;
}
