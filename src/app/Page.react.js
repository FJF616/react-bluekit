import '../helpers/BluekitEvent';
import * as colors from './styles/Colors.js'
import AllComponentsPreview from './AllComponentsPreview.react';
import DetailPage from './Detail/Page.react';
import FontBold from './styles/FontBold';
import Radium, {StyleRoot} from 'radium';
import React, {Component, PropTypes as RPT} from 'react';
import Sidebar from './Sidebar.react';
import StateProvider from './StateProvider.react';
import {FontStyle} from './styles/Font';

if (typeof window !== 'undefined') {
  require('brace');
  require('brace/ext/language_tools');
  require('brace/mode/jsx');
  require('brace/mode/html');
  require('brace/mode/javascript');
  require('brace/theme/chrome');
}


@StateProvider
@Radium
export default class Page extends Component {

  static propTypes = {
    components: RPT.object.isRequired,
    customProps: RPT.object,
    filteredComponents: RPT.object.isRequired,
    height: RPT.string,
    inline: RPT.bool,
    mountPoint: RPT.string,
    searchedText: RPT.string,
    selectedAtom: RPT.string,
    simplePropsSelected: RPT.bool,
    sourceBackground: RPT.string,
    triggeredProps: RPT.object
  }

  static contextTypes = {
    resetLocalStorage: RPT.func.isRequired,
    resetPropsToDefault: RPT.func.isRequired,
    selectAtom: RPT.func.isRequired,
    searchAtoms: RPT.func.isRequired,
    toggleProps: RPT.func.isRequired
  }

  static defaultProps = {
    height: '500px',
    inline: false
  }

  render() {
    const {filteredComponents, height, inline, selectedAtom, searchedText} = this.props
    const {selectAtom, searchAtoms} = this.context

    return (
      <StyleRoot>
        <div style={[styles.wrapper.base, inline ? {height: height} : styles.wrapper.full]}>
          <div style={styles.sidebar}>
            <Sidebar
              components={filteredComponents}
              searchAtoms={searchAtoms}
              searchedText={searchedText}
              selectAtom={selectAtom}
              selectedAtom={selectedAtom}
            />
          </div>
          <div style={styles.content}>
            {selectedAtom ? this.renderAtom() : this.renderList()}
          </div>
        </div>
        <FontStyle />
        <FontBold />
      </StyleRoot>
    );
  }

  renderAtom() {
    const {components, customProps, selectedAtom, simplePropsSelected, sourceBackground, triggeredProps} = this.props

    if (!components.get(selectedAtom))
      return <b>Unable to render {selectedAtom} - not in components list</b>

    return (
      <DetailPage
        Component={components.getIn([selectedAtom, 'component'])}
        backgroundColor={sourceBackground}
        componentName={components.getIn([selectedAtom, 'name'])}
        componentPropsDefinition={components.getIn([selectedAtom, 'definition'])}
        customProps={customProps.get(selectedAtom)}
        selectedAtom={selectedAtom}
        simplePropsSelected={simplePropsSelected}
        triggeredProps={triggeredProps}
      />
    );
  }

  renderList() {
    const {filteredComponents, sourceBackground} = this.props
    const {selectAtom} = this.context

    return (
      <div style={[styles.list]}>
        <AllComponentsPreview
          backgroundColor={sourceBackground}
          components={filteredComponents}
          selectAtom={selectAtom}
        />
      </div>
    );
  }
}

const styles = {
  wrapper: {
    base: {
      background: 'white',
      width: '100%'
    },
    full: {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  sidebar: {
    width: '20%',
    height: '100%',
    display: 'inline-block',
    overflow: 'hidden',
    boxSizing: 'border-box',
    borderRight: `1px solid ${colors.GRAY_DARKER}`,
    position: 'relative',
    verticalAlign: 'top'
  },
  content: {
    width: '80%',
    height: '100%',
    display: 'inline-block',
    position: 'relative',
    verticalAlign: 'top'
  },
  list: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflowY: 'auto'
  }
};
