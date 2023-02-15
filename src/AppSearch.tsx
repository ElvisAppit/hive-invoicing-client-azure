import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { InputText } from 'primereact/inputtext'

const AppSearch = (props: any) => {
  const searchRef = React.useRef(null)
  let searchInputEl: any = null

  const onInputKeydown = (event: any) => {
    const key = event.which

    // escape, tab and enter
    if (key === 27 || key === 9 || key === 13) {
      props.onSearchHide(event)
    }
  }

  const onEnter = () => {
    if (searchInputEl) {
      searchInputEl.focus()
    }
  }

  return (
    <div className='layout-search'>
      <CSSTransition
        nodeRef={searchRef}
        classNames='search-container'
        timeout={{ enter: 400, exit: 400 }}
        in={props.searchActive}
        unmountOnExit
        onEnter={onEnter}
      >
        <div ref={searchRef} className='search-container' onClick={props.onSearchClick}>
          <i className='pi pi-search'></i>
          <InputText
            ref={(el) => (searchInputEl = el)}
            type='text'
            name='search'
            placeholder='Search'
            onKeyDown={onInputKeydown}
          />
        </div>
      </CSSTransition>
    </div>
  )
}

export default AppSearch
