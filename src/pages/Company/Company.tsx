import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Image } from 'primereact/image'
import {
  FileUpload,
  FileUploadFilesParam,
  FileUploadHeaderTemplateOptions,
} from 'primereact/fileupload'
import i18next, { t } from 'i18next'
import { CompanyInfo } from '../../interfaces/CompanyInterfaces'
import { ManagePageButtonsProps } from '../../interfaces/shared/types'
import {
  getCompanyInfo,
  manageCompanyInfo,
  uploadCompanyPicture,
  removeCompanyPicture,
} from '../../services/CompanyService'
import { errorToast, infoToast, successToast } from '../../utils/ToastCommon'
import {
  ALLOWED_TYPES,
  EMPTY_STRING,
  INPUT_TYPE,
  STATUS_CODES,
  USER_AUTH_LOCAL_STORAGE,
} from '../../utils/constants'
import { EMPTY_COMPANY_INFO, STYLE_CANCEL_OPTIONS, STYLE_CHOOSE_OPTIONS } from './constants'

const Company = forwardRef(function companyFunction(
  { isView, setIsView }: ManagePageButtonsProps,
  ref,
) {
  const initalCompanyInfo = useRef<CompanyInfo>({} as CompanyInfo)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(EMPTY_COMPANY_INFO)
  const [selectedFile, setSelectedFile] = useState<string | Blob>(EMPTY_STRING)
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(EMPTY_STRING)
  const [editSwitcher, setEditSwitcher] = useState<boolean>(false)
  const [isEdited, setIsEdited] = useState<boolean>(false)
  const toast = useRef<Toast>({} as Toast)
  const { handleSubmit } = useForm()

  useEffect(() => {
    getCompanyData()
  }, [i18next.language, editSwitcher])

  const getCompanyData = () => {
    getCompanyInfo().then((response) => {
      if (response.status == STATUS_CODES.SUCCESS) {
        setCompanyInfo(response.data.item)
        initalCompanyInfo.current = response.data.item
        setFilePreview(
          initalCompanyInfo.current.logoUrl
            ? initalCompanyInfo.current.logoUrl
            : EMPTY_COMPANY_INFO.logoUrl,
        )
      }
    })
  }
  // TODO - refactor code - logoUrl should not be in userAuth - new task
  const updateUserAuthLogo = (logoUrl: string) => {
    const userAuthLocalStorage = JSON.parse(localStorage.getItem(USER_AUTH_LOCAL_STORAGE) as string)
    localStorage.setItem(
      USER_AUTH_LOCAL_STORAGE,
      JSON.stringify({
        ...userAuthLocalStorage,
        logoUrl: logoUrl,
      }),
    )
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, valueOld: string) => {
    setCompanyInfo((prev: CompanyInfo) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    })
    // A new constant "isEdited" of boolean type is defined.
    // The line of code below compares the new value with the initial one
    // and for each change of all input text fields (in this case) it sets the state of this constant.
    // The constant is used in the condition of the "saveCompanyInfo" function,
    // and it depends on its value whether the API call will be made.
    setIsEdited(valueOld.trim() !== e.target.value.trim() ?? false)
  }

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }))

  const saveCompanyInfo = () => {
    if (!isView && isEdited) {
      if (selectedFile) {
        const formData = new FormData()
        formData.append(INPUT_TYPE.FILE, selectedFile)
        uploadCompanyPicture(formData).then((res) => {
          updateUserAuthLogo(res.data.logoUrl)
        })
        toast.current.show(successToast(t('companySettings.companyLogoSaved').toString()))
      } else {
        if (companyInfo.logoUrl) {
          removeCompanyPicture().then((response) => {
            if (response.status == STATUS_CODES.SUCCESS) {
              updateUserAuthLogo(EMPTY_STRING)
              toast.current.show(infoToast(t('companySettings.companyLogoDeleted').toString()))
            }
          })
        }
      }

      manageCompanyInfo(companyInfo).then((response) => {
        if (response.status == STATUS_CODES.SUCCESS) {
          toast.current.show(successToast(t('companySettings.updated').toString()))
        } else {
          toast.current.show(errorToast(t('companySettings.updatedError').toString()))
        }
        setEditSwitcher(!editSwitcher)
      })
    }
    setSelectedFile(EMPTY_STRING)
    setIsView(!isView)
    setIsEdited(false)
  }

  const onTemplateSelect = (e: FileUploadFilesParam) => {
    const file = e.files?.[0]
    if (file && ALLOWED_TYPES.includes(file.type)) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setSelectedFile(file)
      toast.current.show(infoToast(t('common.uploadImageSelected').toString()))
      setIsEdited(true)
    } else {
      toast.current.show(errorToast(t('common.uploadImageError').toString()))
      setSelectedFile(EMPTY_STRING)
      setIsView(!isView)
    }
  }

  const onTemplateClear = () => {
    setFilePreview(
      initalCompanyInfo.current.logoUrl
        ? initalCompanyInfo.current.logoUrl
        : EMPTY_COMPANY_INFO.logoUrl,
    )
    setIsView(!isView)
  }

  const onDeleteClick = () => {
    setIsEdited(true)
    setSelectedFile(EMPTY_STRING)
    setFilePreview(EMPTY_COMPANY_INFO.logoUrl)
    toast.current.show(infoToast(t('common.uploadImageRemoved').toString()))
  }

  const headerImageTemplate = ({ chooseButton, cancelButton }: FileUploadHeaderTemplateOptions) => {
    return isView ? null : (
      <div className='buttonBarFileUpload p-1 md:pt-5'>
        {chooseButton}
        {cancelButton}
        <Button
          type='button'
          label={t('common.delete').toString()}
          className='custom-cancel-btn p-button-danger p-button-text'
          icon='pi pi-trash'
          onClick={onDeleteClick}
          disabled={companyInfo.logoUrl ? false : true}
        />
      </div>
    )
  }

  const imageTemplate = () => {
    return (
      <div className='flex align-items-center justify-content-between flex-column shadow-2 p-5'>
        <Image
          src={
            (filePreview as string) !== EMPTY_STRING
              ? (filePreview as string)
              : (initalCompanyInfo.current.logoUrl as string)
          }
          alt='Company Image'
          width={!isView ? '80' : '100'}
          className='p-image-preview-container p-image-preview'
          preview
        />
        <span
          style={{
            fontSize: '1em',
            color: 'var(--text-color-secondary)',
            display: !isView ? 'flex' : 'none',
          }}
          className='my-3'
        >
          {t('common.dragAndDropImage')}
        </span>
      </div>
    )
  }

  return (
    <div>
      <Toast ref={toast}></Toast>

      <form id='hook-form' onSubmit={handleSubmit(saveCompanyInfo)}>
        <div className='col-12'>
          <div className='grid formgrid'>
            <div className='col-12 md:col-6 lg:col-9 '>
              <div className='grid formgrid'>
                <div className='col-12 p-0'>
                  <div className='field col-12 md:col-6 lg:col-4'>
                    <label htmlFor='companyName'>{t('common.name')}</label>
                    <InputText
                      id='companyName'
                      type='text'
                      required
                      disabled={isView}
                      name='companyName'
                      value={companyInfo.companyName as string}
                      onChange={(e) =>
                        handleInput(e, initalCompanyInfo.current.companyName as string)
                      }
                      className='text-primary '
                      autoFocus
                    />
                  </div>
                </div>
                <div className='field col-12 md:col-6 lg:col-4'>
                  <label htmlFor='address'>{t('contacts.address')}</label>
                  <InputText
                    id='address'
                    type='text'
                    required
                    disabled={isView}
                    name='address'
                    value={companyInfo.address as string}
                    onChange={(e) => handleInput(e, initalCompanyInfo.current.address as string)}
                  />
                </div>
                <div className='field col-12 md:col-6 lg:col-4'>
                  <label htmlFor='city'>{t('contacts.city')}</label>
                  <InputText
                    id='city'
                    type='text'
                    required
                    disabled={isView}
                    name='city'
                    value={companyInfo.city as string}
                    onChange={(e) => handleInput(e, initalCompanyInfo.current.city as string)}
                  />
                </div>
                <div className='field col-12 md:col-6 lg:col-4'>
                  <label htmlFor='zip'>{t('contacts.zipCode')}</label>
                  <InputText
                    id='zip'
                    type='text'
                    required
                    disabled={isView}
                    name='zip'
                    value={companyInfo.zip as string}
                    onChange={(e) => handleInput(e, initalCompanyInfo.current.zip as string)}
                  />
                </div>
                <div className='field col-12 md:col-6 lg:col-4'>
                  <label htmlFor='country'>{t('contacts.country')}</label>
                  <InputText
                    id='country'
                    type='text'
                    required
                    disabled={isView}
                    name='country'
                    value={companyInfo.country as string}
                    onChange={(e) => handleInput(e, initalCompanyInfo.current.country as string)}
                  />
                </div>
                <div className='field col-12 md:col-6 lg:col-4'>
                  <label htmlFor='idNumber'>{t('companySettings.idNumber')}</label>
                  <InputText
                    id='idNumber'
                    type='text'
                    required
                    disabled={isView}
                    name='idNumber'
                    value={companyInfo.idNumber as string}
                    onChange={(e) => handleInput(e, initalCompanyInfo.current.idNumber as string)}
                  />
                </div>
                <div className='field col-12 md:col-6 lg:col-4'>
                  <label htmlFor='taxNumber'>{t('companySettings.taxNumber')}</label>
                  <InputText
                    id='taxNumber'
                    type='text'
                    required
                    disabled={isView}
                    name='taxNumber'
                    value={companyInfo.taxNumber as string}
                    onChange={(e) => handleInput(e, initalCompanyInfo.current.taxNumber as string)}
                  />
                </div>
              </div>
            </div>
            <div className='col-12 md:col-6 lg:col-3 md:pr-5 flex align-items-center justify-content-center'>
              <div id='companyImage'>
                <FileUpload
                  name='companyImage'
                  accept={ALLOWED_TYPES.toString()}
                  maxFileSize={3000000}
                  // customUpload
                  onSelect={onTemplateSelect}
                  onError={onTemplateClear}
                  onClear={onTemplateClear}
                  chooseOptions={STYLE_CHOOSE_OPTIONS}
                  cancelOptions={STYLE_CANCEL_OPTIONS}
                  chooseLabel={t('common.choose').toString()}
                  cancelLabel={t('common.cancel').toString()}
                  disabled={isView}
                  headerTemplate={headerImageTemplate}
                  emptyTemplate={imageTemplate}
                  itemTemplate={imageTemplate}
                  progressBarTemplate
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
})
export default Company
