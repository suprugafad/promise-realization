class MyPromise {

    constructor(callback) {
        this.onCatch = null
        this.onFinally = null
        this.thenCbs = []
        this.isRejected = false

        function resolver(data) {
            if (this.isRejected) {
                return
            }

            this.thenCbs.forEach(cb => {
                data = cb(data)
            })

            if (this.onFinally) {
                this.onFinally()
            }
        }

        function rejecter(err) {
            this.isRejected = true

            if (this.onCatch) {
                this.onCatch(err)
            }

            if (this.onFinally) {
                this.onFinally()
            }
        }
        callback(resolver.bind(this), rejecter.bind(this))
    }

    then(cb) {
        this.thenCbs.push(cb)
        return this
    }

    catch(cb) {
        this.onCatch = cb
        return this
    }

    finally(cb) {
        this.onFinally = cb
        return this
    }
}

const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject('errrrrrrrrrror')
        resolve(2)
    }, 2000)
})

promise
    .then(num => num *= 2)
    .catch(err => console.error(err))
    .finally(()=> console.log('finally'))
    .then(num => {
        num *= 3
        console.log(num)
    })
