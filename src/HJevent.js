
class HJevent {
    /**
    * 对一个指定事件向该事件的collection中添加一个监听函数
    * @function参数解释
    * @param {String} event - 想要添加的事件名称，字符串类型
    * @param {Function} listener - 要添加的监听函数，函数类型
    * @returns {Object} 返回Emitter实例
    */
    on(event, listener) {
        // 使用现有的collection，如果不存在，则创建
        this.eventCollection = this.eventCollection || {};
        this.eventCollection[event] = this.eventCollection[event] || [];

        // 讲给定的监听函数push进入指定事件的collection
        this.eventCollection[event].push(listener);

        return this;
    }

    addListener(event, listener) {
        return this.on(event, listener);
    }

    /**
    * 使用on方法，并劫持listener参数，注意this漂移问题.
    * @function参数解释
    * @param {String} event - 想要添加的事件名称，字符串类型
    * @param {Function} listener - 要添加的监听函数，函数类型
    * @returns {Object} 返回Emitter实例
    */
    once(event, listener) {
        // 使用箭头函数绑定this
        const fn = () => {
            this.off(event, fn);
            listener.apply(this, arguments);
        }

        // const self = this;
        // function fn () {
        //     self.off(event, fn);
        //     listener.apply(self, arguments);
        // }

        fn.listener = listener;

        this.on(event, fn);

        return this;
    }

    /**
     * 对指定的事件在其collection之中删除一个监听函数
     * @function
     * @param {String} event - 想要删除的事件名称
     * @param {Function} listener - 要删除的监听函数
     * @returns {Object} 返回Emitter实例
     */
    off(event, listener) {

        // 指定事件的监听函数数组
        let listeners;

        // 指定的事件的collection不存在，则直接返回实例
        if (!this.eventCollection || !(listeners = this.eventCollection[event])) {
            return this;
        }

        listeners.forEach((fn, i) => {
            if (fn === listener || fn.listener === listener) {
                // 删除监听函数
                listeners.splice(i, 1);
            }
        });

        // 如果删除指定监听函数后该指定事件的监听函数数组为空，则删除此collection
        if (listeners.length === 0) {
            delete this.eventCollection[event];
        }

        return this;
    }

    /**
     * 删除所有事件的监听函数
     * @function
     * @param {String} event - 想要删除的事件名称，字符串类型
     * @returns {Object} 返回Emitter实例
     */
    offAll(event) {
        if (!this.eventCollection) {
            return this;
        }
        else if (typeof this.eventCollection[event] === 'undefined') {
            let eventArray = Object.keys(this.eventCollection);
            eventArray.forEach((v, i)=>{this.eventCollection[v].length = 0;})
        }
        else {
            this.eventCollection[event].length = 0;
        }

        return this;
    }

    /**
     * 所有指定事件的所有监听函数数组
     * @function
     * @param {String} event - 指定的事件名称，字符串类型
     * @returns 指定事件的监听函数数组
     * @example
     * emitter.listeners('foo');
     */
    listeners(event) {
        return this.eventCollection[event];
    }

    /**
     * 按照存储顺序，依次执行指定事件的监听函数
     * @function
     * @param {String} event - 想要触发的事件名称，字符串类型
     * @param {...Object} data - 想要传递给监听函数的数据
     * @returns {Object}         返回实例便于链式调用
     */
    emit(event, ...args) {

        // 指定事件的监听函数数组
        let listeners;

        // 指定的事件的collection不存在，则直接返回实例
        if (!this.eventCollection || !(listeners = this.eventCollection[event])) {
            return this;
        }

        // 克隆监听函数群
        // 如果某一个监听器调用了 on / off ，那么肯定会对 listeners 数组进行修改
        // 有两个说法一个是避免死循环，一个是让执行顺序清晰，不知道到底是哪个。至少forEach不会由于动态增加而陷入死循环
        listeners = listeners.slice(0);

        listeners.forEach(fn => fn.apply(this, args));

        return this;
    }

}
export default HJevent;
