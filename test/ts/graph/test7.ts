import TestRunner from '../TestRunner';
import Graph from '../../../src/graph/Graph';

TestRunner.test({
    name: 'Changes can be pulled to deep layers.',
    test: function(input, callback) {
        var runsB = 0;
        var runsC = 0;
        var runsD = 0;
        var runsE = 0;
        var model: any = {};
        Graph.createObservable(model, 'a', 1);
        Graph.createComputed(model, 'b', function() {
            runsB++;
            return model.a;
        });
        Graph.createComputed(model, 'c', function() {
            runsC++;
            return model.b;
        });
        Graph.createComputed(model, 'd', function() {
            runsD++;
            return model.c;
        });
        Graph.createComputed(model, 'e', function() {
            runsE++;
            return model.d;
        });
        model._graph.observables.e.subscribe(function(value) {
            if (result) {
                result.finalE = value;
                result.finalRunsE = runsE
                callback(result);
            }
        });
        model.a = 11;
        var d = model.d;
        var result: any = {
            a: model._graph.observables.a.value,
            b: model._graph.observables.b.value,
            c: model._graph.observables.c.value,
            d: d,
            e: model._graph.observables.e.value,
            runsB: runsB,
            runsC: runsC,
            runsD: runsD,
            runsE: runsE
        };
    },
    assert: function(result, callback) {
        callback(
            result.a == 11 &&
            result.b == 11 &&
            result.c == 11 &&
            result.d == 11 &&
            result.e == 1 &&
            result.finalE == 11 &&
            result.runsB == 2 &&
            result.runsC == 2 &&
            result.runsD == 2 &&
            result.runsE == 1 &&
            result.finalRunsE == 2
        );
    }
});