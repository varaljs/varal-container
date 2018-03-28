class Container {

    constructor() {
        this.binds = {};
        this.instances = {};
    }

    bind(abstract, concrete) {
        if (typeof concrete === 'function')
            this.binds[abstract] = concrete;
        else
            this.instances[abstract] = concrete;
    }

    singleton(abstract, concrete) {
        if (typeof concrete === 'function')
            this.instances[abstract] = concrete(this);
        else
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
                if (Array.isArray(dependencies))
                    return new abstract(...dependencies, ...args);
                else if (dependencies instanceof Map) {
                    const instance = new abstract(...args);
                    for (let [key, dependency] of dependencies)
                        instance[key] = dependency;
                    return instance;
                } else
                    throw new Error('Invalid injector')
            } else
                return new abstract(...args);
    }

}

exports = module.exports = Container;