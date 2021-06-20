# Async/Await

Below are two example of async/await. In code block 1, there is a single request being made. Note that fetch returns a Promise so await must be used. All Promises must be `await`ed. Note to that async functions return a Promise so `.then` ,must be used to access the data that is returned. 

In the second code block, note the use of `Promise.all()`. With this method we can `await`, push into an array and map a series of requests. Note the use of `try/catch` blocks in both functions to do some error handling.

```
const loadData = async () => {
  try {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    const res = await fetch(url);
    console.log(res.status)
    const data = await res.json();
    return data;
  } catch(err){ 
  console.error(err);
  }
}

loadData().then((data) => console.log(data));
```

```
const loadData = async () => {
  try {
    const url1 = 'https://jsonplaceholder.typicode.com/todos/1';
    const url2 = 'https://jsonplaceholder.typicode.com/todos/2';
    const url3 = 'https://jsonplaceholder.typicode.com/todos/3';
    const results = await Promise.all([
      fetch(url1), 
      fetch(url2), 
      fetch(url3)
    ])
    const finalData = await Promise.all(results.map(result => result.json()));
    return finalData;
  } catch(err){ 
  console.error(err);
  }
}

loadData().then((data) => console.log(data));
```