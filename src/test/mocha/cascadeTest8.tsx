import {expect} from 'chai';

import Cascade, {Component, observable} from '../../scripts/modules/Cascade';

class ViewModel {
    @observable a: string = 'a';
    parentNode: Node;
    childNode: Node;
    parentRef(node: Node) {
        this.parentNode = node;
    }
    childRef(node: Node) {
        this.childNode = node;
    }
}

interface IParentProperties {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProperties> {
    render() {
        return (
            <div>
                <span ref={this.properties.viewModel.childRef.bind(this.properties.viewModel)}>Text</span>
            </div>
        );
    }
}

describe('Component', function() {
    it('should use ref callbacks', function() {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} ref={viewModel.parentRef.bind(viewModel)}/>);
        expect((viewModel.parentNode as HTMLElement).tagName).to.equal('DIV');
        expect((viewModel.childNode as HTMLElement).tagName).to.equal('SPAN');
    });
});
