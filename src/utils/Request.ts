
const get = (url:string, data:any, successCallBack:any, failCallBack:any) => {
    let bodys = "";

    for(let key in data){
        bodys += key + "=" + encodeURIComponent(data[key]) + "&";
    }
    url = url + '?' + bodys;

    console.log('--------Request.get--------');
    console.log('url', url);

    let myFetch = fetch( url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    });

    return new Promise((resolve,reject) => {
        timeFetch(myFetch,8000)
        .then((response) =>response.json())
        .then((response)=>{
            console.log(response);
            if(typeof successCallBack == 'function'){
                successCallBack(response);
            }
        })
        .catch((error)=>{
            console.log(error);
            if(typeof failCallBack == 'function'){
                failCallBack(error);
            }
        })
    });
}

const post = (url:string, data:any, successCallBack:any, failCallBack:any) => {
    let bodys = "";

    for(let key in data){
        bodys += key + "=" + encodeURIComponent(data[key]) + "&";
    }

    console.log('--------Request.post--------');
    console.log('bodys', bodys);

    let myFetch = fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        body: bodys
    });

    return new Promise((resolve,reject) => {
        timeFetch(myFetch,8000)
        .then((response) =>response.json())
        .then((response)=>{
            console.log(response);
            if(typeof successCallBack == 'function'){
                successCallBack(response);
            }
        })
        .catch((error)=>{
            console.log(error);
            if(typeof failCallBack == 'function'){
                failCallBack(error);
            }
        })
    });
}

const timeFetch = (requestPromise:any, timeout=30000) => {
    let timeoutAction:any = null;
    const timerPromise = new Promise((resolve, reject) => {
        timeoutAction = () => {
            reject(new Error('request timeout'));
        }
    })
    setTimeout(()=>{
        timeoutAction()
    }, timeout);
    return Promise.race([requestPromise,timerPromise]);
}

export default {
    get,
    post,
    timeFetch
}
