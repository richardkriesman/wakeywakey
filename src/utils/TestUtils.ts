/**
 * @module utils
 */

import { ReactTestInstance } from "react-test-renderer";

/**
 * Creates a new mock object for react-navigation's navigation object.
 */
export function createNavigationMock(): any {
    return {
        getParam: jest.fn(),
        navigation: jest.fn(),
        setParams: jest.fn()
    };
}

/**
 * Given a {@link ReactTestInstance} produced by `ReactTestRenderer.getInstance()`, attempts to find a component in the
 * tree with the given test ID.
 *
 * If no component exists in the tree, this will return null.
 *
 * @param node The root node of the component tree
 * @param id The test ID to search for
 */
export function findComponentWithTestId(node: ReactTestInstance, id: string): ReactTestInstance | null {
    if (node.props && node.props.testID === id) { // current node is the component we want
        return node;
    }

    // tree has children, traverse down them
    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            const element: ReactTestInstance | null = findComponentWithTestId(child as ReactTestInstance, id);
            if (element) {
                return element;
            }
        }
    }

    return null; // no element was found
}
