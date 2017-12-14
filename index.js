class Container {

    constructor() {
        this.binds = [];
        this.instances = [];
    }

    bind(abstract, concrete) {
        if (typeof concrete === 'function')
            this.binds[abstract] = concrete;
        else if (typeof concrete === 'string')
            this.instances[abstract] = concrete;
    }

    make(abstract, ...args) {
        if (typeof abstract === 'string') {
            if (this.instances[abstract])
                return this.instances[abstract];
            if (this.binds[abstract])
                return this.binds[abstract](this, ...args);
        } else if (typeof abstract.constructor === 'function')
            if (typeof abstract.injector === 'function') {
                const dependencies = abstract.injector(this);
                return new abstract(...dependencies, ...args);
            } else
                return new abstract(...args);
    }

}

exports = module.exports = Container;