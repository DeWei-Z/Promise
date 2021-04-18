
        function Promise(executor){
            this.PromiseState='pending'
            this.PromiseResult=null
            this.callbacks=[]
         
            resolve=(data)=>{
                if(this.PromiseState!=='pending')return
                this.PromiseState='resolve'
                this.PromiseResult=data
                this.callbacks.forEach(item=>{
                    item.onResolve(data)
                })
            }

            reject=(data)=>{
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

        Promise.prototype.then=function(onResolve,onReject){

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

     
                   
                