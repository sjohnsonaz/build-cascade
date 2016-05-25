var Computed = (function () {
    var id = 0;

    var computedQueue = new ComputedQueue();

    function Computed(definition) {
        Define.super(Observable, this);
        this.id = id;
        id++;

        this.references = [];
        this.definition = definition;
        this.runDefinition(definition);

        return this.value;
    }

    Define.extend(Computed, Observable, {
        setValue: function (value) {},
        notify: function () {
            if (Observable.sync) {
                this.runUpdate();
            } else {
                if (computedQueue.completed) {
                    computedQueue = new ComputedQueue();
                }
                computedQueue.add(this);
            }
        },
        runUpdate: function () {
            var value = this.value;
            this.runDefinition(this.definition);
            if (this.value !== value) {
                this.publish();
            }
        },
        runDefinition: function (definition) {
            //TODO: Reduce unsubscribe calls.
            for (var index = 0, length = this.references.length; index < length; index++) {
                var reference = this.references[index];
                reference.unsubscribe(this);
            }

            Observable.pushContext();
            this.value = definition();
            var context = Observable.popContext();

            //TODO: Prevent redundant subscription.
            for (var index = 0, length = context.length; index < length; index++) {
                var reference = context[index];
                reference.subscribeOnly(this);
            }
        }
    });

    return Computed;
})();
