import { useState } from 'react'
import { DropdownProps, DropdownItem } from '../../interfaces/shared/types'
import { SEARCH_DELAY } from '../../utils/constants'

const SearchDropdown = ({
  dropdownValues,
  setSearchValue,
  currentDropdownValue,
  setDropdownValue,
  enableClick,
}: DropdownProps) => {
  let changeTimeout: ReturnType<typeof setTimeout> | null = null
  const [searchBoxValue, setSearchBoxValue] = useState<string>('')

  const itemClick = (dropdownItem: DropdownItem) => {
    setDropdownValue(dropdownItem)
    setSearchValue('')
    setSearchBoxValue('')
  }

  const searchDropdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBoxValue(e.target.value)
    if (changeTimeout) {
      clearTimeout(changeTimeout)
    }

    changeTimeout = setTimeout(() => {
      setSearchValue(e.target.value.toLowerCase())
    }, SEARCH_DELAY)
  }

  return (
    <div className='dropdown show'>
      <div
        className='btn btn-secondary dropdown-toggle'
        role='button'
        id='dropdownMenuLink'
        data-bs-toggle={enableClick ? 'dropdown' : ''}
        aria-expanded='false'
      >
        {currentDropdownValue}
      </div>
      {
        <ul className='dropdown-menu' aria-labelledby='dropdownMenuLink'>
          {
            <div className='search-box'>
              <input onChange={searchDropdown} value={searchBoxValue} />
            </div>
          }
          {dropdownValues.map((selectedItem: DropdownItem) => (
            <li
              onClick={() => itemClick(selectedItem)}
              key={selectedItem.id}
              value={selectedItem.id as number}
              className='dropdown-item'
              style={{ cursor: 'pointer' }}
            >
              {selectedItem.name}
            </li>
          ))}
        </ul>
      }
    </div>
  )
}

export default SearchDropdown
