import React, { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { t } from 'i18next'
import ManagePageButtons from '../../components/Shared/ManagePageButtons'
import User from './User'
import Company from '../Company/Company'
import { NAVIGATE } from '../../utils/constants'

const Settings = () => {
  const [isView, setIsView] = useState<boolean>(true)
  const cancelEdit = () => {
    setIsView(!isView)
  }
  // TODO (ManagePageButtons Save Button)
  // "Save button" should submit forms on all tabviews (User, Company).
  // Currently it only works on the active tabview.When the User page is done, it needs to be refactored.
  return (
    <div className='tabs-component-tabs'>
      <ManagePageButtons
        isView={isView}
        setIsView={setIsView}
        tableId={NAVIGATE.BACK}
        cancelEdit={cancelEdit}
        hookForm={true}
      />
      <TabView>
        <TabPanel header={t('common.user')}>
          <User
            isView={isView}
            setIsView={setIsView}
            tableId={NAVIGATE.BACK}
            cancelEdit={cancelEdit}
          />
        </TabPanel>
        <TabPanel header={t('common.company')}>
          <Company
            isView={isView}
            setIsView={setIsView}
            tableId={NAVIGATE.BACK}
            cancelEdit={cancelEdit}
          />
        </TabPanel>
      </TabView>
    </div>
  )
}
export default Settings
