import React, { Component } from 'react';
import axios from 'axios';
import { Table, ConfigProvider, Empty } from 'antd';
import { ColumnsType } from 'antd/lib/table';

const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
      <Empty description={ <span>No se encontraron datos</span>} />
    </div>
);

export interface BranchOfficeTable{
    id: string;
    key: number;
    name: string;
    email: string;
    address: string;
    city: string;
}

class BranchOffice extends Component {

    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmYmI3NGY1MC0wYzdjLTRhNTEtYjcxOS1hZDcwMjliMDI3MjUiLCJuYW1lIjoiSm9zZSIsInN1cm5hbWUiOiJBZ3VpcnJlIiwiYmlydGhkYXkiOjE0NjkwMjk0MzQsImVtYWlsIjoiam9zZUBnbWFpbC5jb20iLCJwaG9uZSI6IjA5NzkzODEzNjciLCJkZXZpY2VzVG9rZW4iOltdLCJyb2xlcyI6ImFkbWluIiwiaWF0IjoxNjAzMjMwNjk3LCJleHAiOjE2MDM4MzU0OTd9.n4PmMjfkptRKhlH48NvcseuU_gm31BYIuNYOMeKUvzE'

    config = {
        headers: { Authorization: `Bearer ${this.token}` }
    }

    state = {
        branchOffices: [],
        searchText: '',
        searchedColumn: '',
    };

    async componentDidMount() {
        await axios.get('http://localhost:3000/branch-offices', this.config).then( response => {
          this.setState({branchOffices: response?.data.map((order:any,index:number)=>({
                "key":index+1,
                "id":order?._id,
                "name":order?.name,
                "email":order?.email,
                "address":order?.address?.first_address,
                "city":order?.address?.city,
          }))});
        }).catch(error => {
          console.log(error);
        });
    }

    render() {

        const columns:ColumnsType<BranchOfficeTable> = [
            {
                title: 'ID',
                dataIndex: 'key',
                key: 'key',
            },
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              width: '30%'
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
              width: '20%'
            },
            {
              title: 'Address',
              dataIndex: 'address',
              key: 'address'
            },
            {
              title: 'City',
              dataIndex: 'city',
              key: 'city'
            },
          ];

        return <ConfigProvider renderEmpty={customizeRenderEmpty}>
        <Table columns={columns} dataSource={this.state.branchOffices} rowKey="key" />
      </ConfigProvider>
    }
}

export default BranchOffice;