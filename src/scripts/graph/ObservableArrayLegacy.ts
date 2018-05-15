import Observable from './Observable';
import { IArray } from './IObservable';

export default class ObservableArrayLegacy<T> extends Observable<IArray<T>> {
    constructor(value?: Array<T>) {
        super();
        this.value = this.wrapArray((value instanceof Array) ? value : []);
    }

    wrapArray(value: Array<T>) {
        return new LegacyArray(
            (value instanceof LegacyArray) ?
                value.slice(0) :
                value,
            this
        );
    }

    async setValue(value: Array<T>) {
        if (this.value !== value) {
            var oldValue = this.value;
            value = this.wrapArray((value instanceof Array) ? value : []);
            this.value = value;
            await this.publish(value, oldValue);
        }
    }
}

export class LegacyArray<T> extends Array<T> implements IArray<T> {
    private _containingObservable?: Observable<IArray<T>>;

    // TODO: Fix arguments to match ObservableArray.
    constructor(base?: Array<T>, containingObservable?: Observable<Array<T>>) {
        super();
        var inner = (base || []) as LegacyArray<T>;
        for (var index in LegacyArray.prototype) {
            if (LegacyArray.prototype.hasOwnProperty(index)) {
                inner[index] = LegacyArray.prototype[index];
            }
        }
        inner._containingObservable = containingObservable;
        return inner;
    }

    private publish(value: Array<T>, oldValue?: Array<T>) {
        this._containingObservable.publish(value);
    }

    /**
     * @method push
     * ObservableArray.prototype.push([item1[, item2[, ...]]])
     * Adds one or more elements to the end of an array and returns the new length of the array.
     * @returns
     */
    push(...items: T[]) {
        var output = Array.prototype.push.apply(this, arguments);
        this.publish(this);
        return output;
    }

    /**
     * @method pop
     * ObservableArray.prototype.pop()
     * Removes the last element from an array and returns that element.
     * @returns
     */
    pop() {
        var output = Array.prototype.pop.apply(this, arguments);
        this.publish(this);
        return output;
    }

    /**
     * @method unshift
     * ObservableArray.prototype.unshift([item1[, item2[, ...]]])
     * Adds one or more elements to the front of an array and returns the new length of the array.
     * @returns
     */
    unshift(...items: T[]) {
        var output = Array.prototype.unshift.apply(this, arguments);
        this.publish(this);
        return output;
    }

    /**
     * @method shift
     * ObservableArray.prototype.shift()
     * Removes the first element from an array and returns that element.
     * @returns
     */
    shift() {
        var output = Array.prototype.shift.apply(this, arguments);
        this.publish(this);
        return output;
    }

    /**
     * @method reverse
     * ObservableArray.prototype.reverse()
     * Reverses the order of the elements of an array -- the first becomes the last, and the last becomes the first.
     * @returns
     */
    reverse() {
        var output = Array.prototype.reverse.apply(this, arguments);
        this.publish(this);
        return output;
    }

    /**
     * @method sort
     * ObservableArray.prototype.sort()
     * Sorts the elements of an array in place and returns the array.
     * @returns
     */
    sort() {
        var output = Array.prototype.sort.apply(this, arguments);
        this.publish(this);
        return output;
    }

    /**
     * @method splice
     * ObservableArray.prototype.splice(start, deleteCount[, item1[, item2[, ...]]])
     * Adds and/or removes elements from an array.
     * @returns
     */
    splice(start: number, deleteCount?: number) {
        var output = Array.prototype.splice.apply(this, arguments);
        this.publish(this);
        return output;
    }

    //+ ObservableArray.prototype.fill(value, start, end)
    //Fills all the elements of an array from a start index to an end index with a static value.
    /*
    fill(value: T, start?: number, end?: number) {
        var output = Array.prototype.fill.apply(this, arguments);
        this.publish(this);
        return output;
    }
    */

    removeAll() {
        this.length = 0;
        this.publish(this);
    }

    get(index: number) {
        return this[index];
    }

    set(index: number, value: T) {
        this[index] = value as any;
        this.publish(this);
    }

    remove(value: T) {
        // This will publish as a splice.
        var index = this.indexOf(value);
        if (index != -1) {
            return this.splice(index, 1);
        } else {
            return [];
        }
    }

    pushUnique(value: T) {
        // This will publish as a push.
        var index = this.indexOf(value);
        if (index == -1) {
            this.push(value);
        }
    }

    replaceAll(value: T[]) {
        this.length = 0;
        for (var index = 0, length = value.length; index < length; index++) {
            this[index] = value[index];
        }
        this.publish(this);
    }
}