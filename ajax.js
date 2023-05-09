const url = '';


const xhr = new XMLHttpRequest();

xhr.open('GET', url, true);

xhr.onreadystatechange = function() {
  if( this.readyState !== 4) {
    return;
  }
  
  
  if (this.status === 200) {
    console.log(this.response);
  }
}

xhr.onerror = function() {
  console.log(this.statusText);
}

xhr.responseText = 'json';
xhr.setRequestHeader('Accept', 'application/json');
xhr.send(null);