class Promise{

    constructor(executor){
            this.PromiseState='pending'
            this.PromiseResult=null
            this.callbacks=[]
         
            const resolve=(data)=>{
                if(this.PromiseState!=='pending')return
                this.PromiseState='resolve'
                this.PromiseResult=data
                this.callbacks.forEach(item=>{
                    item.onResolve(data)
                })
            }

            const reject=(data)=>{
                if(this.PromiseState!=='pending')return
                this.PromiseState='reject'
                this.PromiseResult=data
                this.callbacks.forEach(item=>{
                    item.onReject(data)
                })
            }
            try {
                executor(resolve,reject)
            } catch (error) {
                reject(error)
            }
    }

    then=(onResolve,onReject)=>{
        if(typeof onReject ==='undefined'){
            onReject=reason=>{
                throw reason
            }
      }

      if(typeof onResolve ==='undefined'){
          onResolve=value=>value
      }

      return new Promise((resolve,reject)=>{

          try {
              if(this.PromiseState==='resolve'){
                  const result=onResolve(this.PromiseResult)

                  if(result instanceof Promise){
                      result.then(value=>{
                          resolve(value)
                      },reason=>{
                          reject(reason)
                      })
                  }else{
                      resolve(result)
                  }

                  }else if(this.PromiseState==='reject'){
                    const result= onReject(this.PromiseResult)

                      if(result instanceof Promise){
                          result.then(value=>{
                              resolve(value)
                          },reason=>{
                              reject(reason)
                          })
                      }else{
                          resolve(result)
                      }


                  }else if(this.PromiseState==='pending'){
                      this.callbacks.push({
                          onResolve:function(){
                              const result=onResolve(this.PromiseResult)

                              if(result instanceof Promise){
                                  result.then(value=>{
                                      resolve(value)
                                  },reason=>{
                                      reject(reason)
                                  })
                              }else{
                                  resolve(result)
                              }
                          },
                          onReject:function(){
                              const result=onReject(this.PromiseResult)

                              if(result instanceof Promise){
                                  result.then(value=>{
                                      resolve(value)
                                  },reason=>{
                                      reject(reason)
                                  })
                              }else{
                                  resolve(result)
                              }
                          }
                      })
                  }
          } catch (error) {
              reject(error)
          }
      })        
    }

    catch=(onReject)=>{
        return this.then(undefined,onReject)
    }

    static resolve=(value)=>{
        return new Promise((resolve,reject)=>{

                if(value instanceof Promise){
                    value.then(v=>{
                    resolve(v)
                    },r=>{
                    reject(r)
                    })
            }else{
                resolve(value)
            }

        }) 
    }

   static reject=(reason)=>{
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }

    static all=function(promises){
        return new Promise((resolve,reject)=>{
            let count=0
            let arr=[]

          for(let i=0;i<promises.length;i++){
            promises[i].then(value=>{
                count++
                arr[i]=value
                if(count===promises.length){
                    resolve(arr)
                }
            },reason=>{
                reject(reason)
            })
          }
        })
    }

    static race=function(promises){
        return new Promise((resolve,reject)=>{

            for(let i=0;i<promises.length;i++){
                promises[i].then(value=>{
                    resolve(value)
                },reason=>{
                    reject(reason)
                })
            }
        })
    }
}