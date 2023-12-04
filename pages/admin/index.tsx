import React from 'react'

import { NextPage } from 'next'
import { AdminLayout } from '../../components'
import { DashboardOutlined } from '@mui/icons-material'

const AdminPage: NextPage = () => {

    return (
        <AdminLayout
            title='Dashboard'
            subTitle='Estadísticas generales'
            icon={ <DashboardOutlined /> }
        >

            <h3>hola</h3>


        </AdminLayout>
    )
}

export default AdminPage    
