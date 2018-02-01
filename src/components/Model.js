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
        var find = false;



        return find;
      }
    );

    this.rows_display = this.rows_filtered.slice(this.start_index - 1, this.end_index);
  }

}

function http_get(u){
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", u, false);
  xhttp.send(null);
  return xhttp.responseText;
}
