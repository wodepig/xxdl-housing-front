export const useStore = () => {
  /**
   * 经纪人用户名
   */
  const selectAgentUserName = useState('selectAgentUserName',()=>'');
  const selectAgentId = useState('selectAgentId',()=>'');
  const selectAgentAcc = useState('selectAgentAcc',()=>'');
  const selectAgentCk = useState('selectAgentCk',()=>'');
  return {
    selectAgentId,
    selectAgentUserName,
    selectAgentAcc,
    selectAgentCk
  };
}
