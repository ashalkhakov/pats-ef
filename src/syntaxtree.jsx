import React from 'react';

import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';

function
ast2json(root) {
    function map_r(node) {
	switch (node.type) {
	case 'NumericLiteral': // value
	    return {title: node.value.toString()};
	case 'Identifier': // name
	    return {title: node.name};
	case 'BinaryExpression': // operator, left, right
	    const left = map_r(node.left);
	    const right = map_r(node.right);
	    return {title: node.operator, children: [left, right]};
	case 'ArrayExpression': // elements
	    const chld = node.elements.map(arg => map_r(arg));
	    return {title: 'array', children: chld};
	case 'CallExpression': // callee, arguments
	    const callee = map_r(node.callee);
	    var children = node.arguments.map(arg => map_r(arg));
	    return {title: callee.title, children: children};
	default:
	    throw "map_r: unhandled node type " + node.type;
	}
    }
    return map_r(root);
}

// shamelessly ripped from SortableTree demo
export default class SyntaxTree extends React.Component {
    constructor(props) {
        super(props);
	
	var json = ast2json(props.ast);

        this.state = {
            searchString: '',
            searchFocusIndex: 0,
            searchFoundCount: null,
            treeData: [json],
        };
        this.updateTreeData = this.updateTreeData.bind(this);
        this.expandAll = this.expandAll.bind(this);
        this.collapseAll = this.collapseAll.bind(this);	
    }

    updateTreeData(treeData) {
        this.setState({ treeData });
    }

    expand(expanded) {
        this.setState({
            treeData: toggleExpandedForAll({
                treeData: this.state.treeData,
                expanded,
            }),
        });
    }

    expandAll() {
        this.expand(true);
    }

    collapseAll() {
        this.expand(false);
    }
    
    render() {
	const {treeData, searchString, searchFocusIndex, searchFoundCount} = this.state;


        const selectPrevMatch = () => this.setState({
            searchFocusIndex: searchFocusIndex !== null ?
                ((searchFoundCount + searchFocusIndex - 1) % searchFoundCount) :
                searchFoundCount - 1,
        });

        const selectNextMatch = () => this.setState({
            searchFocusIndex: searchFocusIndex !== null ?
                ((searchFocusIndex + 1) % searchFoundCount) :
                0,
        });

        const isVirtualized = true;
        const treeContainerStyle = isVirtualized ? { height: 450 } : {};

        return (
	    <div style={{ height: 400 }}>
	    <button onClick={this.expandAll}>
            Expand All
            </button>

            <button onClick={this.collapseAll}>
            Collapse All
            </button>

	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <form
            style={{ display: 'inline-block' }}
            onSubmit={(event) => {event.preventDefault();}}>
            <label htmlFor="find-box">
            Search:&nbsp;

            <input id="find-box" type="text" value={searchString}
            onChange={event => this.setState({ searchString: event.target.value })}
            />
            </label>

            <button
            type="button"
            disabled={!searchFoundCount}
            onClick={selectPrevMatch}>
            &lt;
            </button>

            <button
            type="submit"
            disabled={!searchFoundCount}
            onClick={selectNextMatch}>
            &gt;
            </button>

            <span>
            &nbsp;
            {searchFoundCount > 0 ? (searchFocusIndex + 1) : 0}
            &nbsp;/&nbsp;
            {searchFoundCount || 0}
            </span>
            </form>
	    
            <SortableTree
            treeData={treeData}
            onChange={this.updateTreeData}
	    searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            searchFinishCallback={matches =>
                this.setState({
                    searchFoundCount: matches.length,
                    searchFocusIndex: matches.length > 0 ? searchFocusIndex % matches.length : 0,
                })
            }
            isVirtualized={isVirtualized}	    
            />
            </div>
        );
    }
}
