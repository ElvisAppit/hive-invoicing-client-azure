import React from 'react'
import { classNames } from 'primereact/utils'
import { RadioButton } from 'primereact/radiobutton'
import { InputSwitch } from 'primereact/inputswitch'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'

const AppConfig = (props: any) => {
  const { t } = useTranslation()
  const menuThemes = [
    {
      name: 'white',
      color: '#ffffff',
      logoColor: 'dark',
      componentTheme: props.componentTheme,
    },
    {
      name: 'darkgray',
      color: '#343a40',
      logoColor: 'white',
      componentTheme: props.componentTheme,
    },
    {
      name: 'blue',
      color: '#1976d2',
      logoColor: 'white',
      componentTheme: 'blue',
    },
    {
      name: 'bluegray',
      color: '#455a64',
      logoColor: 'white',
      componentTheme: 'lightgreen',
    },
    {
      name: 'brown',
      color: '#5d4037',
      logoColor: 'white',
      componentTheme: 'cyan',
    },
    {
      name: 'cyan',
      color: '#0097a7',
      logoColor: 'white',
      componentTheme: 'cyan',
    },
    {
      name: 'green',
      color: '#388e3C',
      logoColor: 'white',
      componentTheme: 'green',
    },
    {
      name: 'indigo',
      color: '#303f9f',
      logoColor: 'white',
      componentTheme: 'indigo',
    },
    {
      name: 'deeppurple',
      color: '#512da8',
      logoColor: 'white',
      componentTheme: 'deeppurple',
    },
    {
      name: 'orange',
      color: '#F57c00',
      logoColor: 'dark',
      componentTheme: 'orange',
    },
    {
      name: 'pink',
      color: '#c2185b',
      logoColor: 'white',
      componentTheme: 'pink',
    },
    {
      name: 'purple',
      color: '#7b1fa2',
      logoColor: 'white',
      componentTheme: 'purple',
    },
    {
      name: 'teal',
      color: '#00796b',
      logoColor: 'white',
      componentTheme: 'teal',
    },
  ]

  const componentThemes = [
    { name: 'blue', color: '#42A5F5' },
    { name: 'green', color: '#66BB6A' },
    { name: 'lightgreen', color: '#9CCC65' },
    { name: 'purple', color: '#AB47BC' },
    { name: 'deeppurple', color: '#7E57C2' },
    { name: 'indigo', color: '#5C6BC0' },
    { name: 'orange', color: '#FFA726' },
    { name: 'cyan', color: '#26C6DA' },
    { name: 'pink', color: '#EC407A' },
    { name: 'teal', color: '#26A69A' },
  ]

  const onConfigButtonClick = (event: any) => {
    props.onConfigButtonClick(event)
    event.preventDefault()
  }

  const getMenuThemes = () => {
    if (props.colorScheme === 'light') {
      return (
        <div className='layout-themes'>
          {menuThemes.map((theme) => {
            const checkStyle = theme.name === 'white' ? 'black' : 'white'
            return (
              <div key={theme.name}>
                <button
                  type='button'
                  className='p-link'
                  style={{ cursor: 'pointer', backgroundColor: theme.color }}
                  onClick={() =>
                    props.changeMenuTheme(theme.name, theme.logoColor, theme.componentTheme)
                  }
                  title={theme.name}
                >
                  {props.menuTheme === 'layout-sidebar-' + theme.name && (
                    <span className='check flex align-items-center justify-content-center'>
                      <i className='pi pi-check' style={{ color: checkStyle }}></i>
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div>
        <p>{t('menuConfig.menuModeMessage')}</p>
      </div>
    )
  }

  const getComponentThemes = () => {
    return (
      <div className='layout-themes'>
        {componentThemes.map((theme) => {
          return (
            <div key={theme.name}>
              <button
                type='button'
                className='p-link'
                style={{ cursor: 'pointer', backgroundColor: theme.color }}
                onClick={() => props.changeComponentTheme(theme.name)}
                title={theme.name}
              >
                {props.componentTheme === theme.name && (
                  <span className='check flex align-items-center justify-content-center'>
                    <i className='pi pi-check' style={{ color: 'white' }}></i>
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  const componentThemesElement = getComponentThemes()
  const menuThemesElement = getMenuThemes()
  const configClassName = classNames('layout-config', {
    'layout-config-active': props.configActive,
  })
  return (
    <div id='layout-config'>
      <Button
        className='layout-config-button'
        icon='pi pi-cog p-button-icon'
        type='button'
        onClick={onConfigButtonClick}
      ></Button>
      <div className={configClassName} onClick={props.onConfigClick}>
        <h5>{t('menuConfig.menuType')}</h5>
        <div className='field-radiobutton'>
          <RadioButton
            name='menuMode'
            value='static'
            checked={props.menuMode === 'static'}
            inputId='mode1'
            onChange={props.onMenuModeChange}
          ></RadioButton>
          <label htmlFor='mode1'>{t('menuConfig.static')}</label>
        </div>
        <div className='field-radiobutton'>
          <RadioButton
            name='menuMode'
            value='overlay'
            checked={props.menuMode === 'overlay'}
            inputId='mode2'
            onChange={props.onMenuModeChange}
          ></RadioButton>
          <label htmlFor='mode2'>{t('menuConfig.overlay')}</label>
        </div>
        <div className='field-radiobutton'>
          <RadioButton
            name='menuMode'
            value='slim'
            checked={props.menuMode === 'slim'}
            inputId='mode3'
            onChange={props.onMenuModeChange}
          ></RadioButton>
          <label htmlFor='mode3'>{t('menuConfig.slim')}</label>
        </div>
        <div className='field-radiobutton'>
          <RadioButton
            name='menuMode'
            value='horizontal'
            checked={props.menuMode === 'horizontal'}
            inputId='mode4'
            onChange={props.onMenuModeChange}
          ></RadioButton>
          <label htmlFor='mode4'>{t('menuConfig.horizontal')}</label>
        </div>
        <hr />

        <h5>{t('menuConfig.colorScheme')}</h5>
        <div className='field-radiobutton'>
          <RadioButton
            name='colorScheme'
            value='dark'
            checked={props.colorScheme === 'dark'}
            inputId='theme1'
            onChange={props.changeColorScheme}
          ></RadioButton>
          <label htmlFor='theme1'>{t('menuConfig.dark')}</label>
        </div>
        <div className='field-radiobutton'>
          <RadioButton
            name='colorScheme'
            value='dim'
            checked={props.colorScheme === 'dim'}
            inputId='theme2'
            onChange={props.changeColorScheme}
          ></RadioButton>
          <label htmlFor='theme2'>{t('menuConfig.dim')}</label>
        </div>
        <div className='field-radiobutton'>
          <RadioButton
            name='colorScheme'
            value='light'
            checked={props.colorScheme === 'light'}
            inputId='theme3'
            onChange={props.changeColorScheme}
          ></RadioButton>
          <label htmlFor='theme3'>{t('menuConfig.light')}</label>
        </div>

        <hr />

        <h5>{t('menuConfig.inputStyle')}</h5>
        <div className='field-radiobutton'>
          <RadioButton
            inputId='input_outlined'
            name='inputstyle'
            value='outlined'
            checked={props.inputStyle === 'outlined'}
            onChange={(e) => props.onInputStyleChange(e.value)}
          />
          <label htmlFor='input_outlined'>{t('menuConfig.outlined')}</label>
        </div>
        <div className='field-radiobutton'>
          <RadioButton
            inputId='input_filled'
            name='inputstyle'
            value='filled'
            checked={props.inputStyle === 'filled'}
            onChange={(e) => props.onInputStyleChange(e.value)}
          />
          <label htmlFor='input_filled'>{t('menuConfig.filled')}</label>
        </div>

        <hr />

        <h5>{t('menuConfig.rippleEffect')}</h5>
        <InputSwitch checked={props.rippleActive} onChange={props.onRippleChange} />

        <hr />

        <h5>{t('menuConfig.menuThemes')}</h5>
        {menuThemesElement}

        <hr />

        <h5>{t('menuConfig.componentThemes')}</h5>
        {componentThemesElement}
      </div>
    </div>
  )
}

export default AppConfig
