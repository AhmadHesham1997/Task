
import React from 'react';
import { Table } from 'antd';

const { Column } = Table;

const CustomerTable = ({ transactions, customers, handleCustomerClick, getCustomerName }) => {
  return (
    <Table responsive
      dataSource={transactions}
      rowKey="id"
      onRow={(record) => ({
        onClick: () => handleCustomerClick(record.customer_id),
      })}
    >
      <Column
        title="Customer"
        dataIndex="customer_id"
        key="customer_id"
        render={(text, record) => getCustomerName(record.customer_id)}
      />
      <Column title="Date" dataIndex="date" key="date" />
      <Column title="Amount" dataIndex="amount" key="amount" />
    </Table>
  );
};

export default CustomerTable;

