import React, { Component } from "react";
import * as moment from 'moment';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  TextField,
  InputAdornment
} from '@material-ui/core';

import Loader from '../loader'

import SearchIcon from '@material-ui/icons/Search';

import Store from "../../stores";
import { colors } from '../../theme'

import {
  ERROR,
  START_LOADING,
  STOP_LOADING,
  CONNECTION_CONNECTED,
  ACCOUNT_CHANGED,
  GET_CURRENT_BLOCK,
  CURRENT_BLOCK_RETURNED,
  GET_KEEPER,
  KEEPER_RETURNED,
  GET_JOBS,
  JOBS_RETURNED,
  GET_KEEPERS,
  KEEPERS_RETURNED,
  ADD_BOND,
  ADD_BOND_RETURNED,
  REMOVE_BOND,
  REMOVE_BOND_RETURNED,
  ACTIVATE_BOND,
  ACTIVATE_BOND_RETURNED,
  WITHDRAW_BOND,
  WITHDRAW_BOND_RETURNED
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // paddingBottom: '60px',
    // background: colors.white,
  },
  between: {
    width: '40px'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '900px',
    marginBottom: '20px',
    // background: colors.white,
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: '10px',
    }
  },
  topButton: {
    width: '160px',
    marginBottom: '24px',
    [theme.breakpoints.down('sm')]: {
      minWidth: '90vw',
    }
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '10px',
    marginBottom: '24px',
    background: colors.white,
    [theme.breakpoints.down('sm')]: {
      minWidth: '90vw',
    }
  },
  keeperLayout: {
    display: 'flex',
    maxWidth: '1200px',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  profileContainer: {
    display: 'flex',
    width: '300px',
    border: '1px solid '+colors.borderBlue,
    borderRadius: '10px',
    padding: '24px',
    marginRight: '20px',
    flexDirection: 'column',
    background: colors.white,
    alignSelf: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      minWidth: '90vw',
      marginRight: '0px',
      marginBottom: '25px'
    }
  },
  valueContainer: {
    width: '100%',
    margin: '12px 0px',
    position: 'relative'
  },
  valueTitle: {
    color: colors.darkGray,
    marginBottom: '6px'
  },
  valueValue: {

  },
  valueAction: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  valueActionBonds: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  valueActionBondsAction: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '100%'
  },
  jobsContainer: {
    display: 'flex',
    flex: 1,
    border: '1px solid '+colors.borderBlue,
    borderRadius: '10px',
    padding: '24px',
    marginLeft: '20px',
    flexDirection: 'column',
    background: colors.white,
    alignSelf: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0px',
      maxWidth: '90vw',
      marginBottom: '20px'

    }
  },
  title: {
    width: '100%',
    borderBottom: '1px solid '+colors.borderBlue,
    paddingBottom: '12px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '40px'
  },
  inputContainer: {
    flex: 1,
    display: 'flex',
    position: 'relative',
  },
  balance: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    position: 'absolute',
    zIndex: 1,
    right: '8px',
    top: '2px',
    letterSpacing: '0.1rem',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  textField: {
    flex: 1,
    width: '100%',
  },
  valueActionButtons: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px'
  },
  searchInputAdornment: {
    cursor: 'pointer'
  },
  actionInput: {
    // background: colors.white
  },
  jobContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '12px 0px',
    '&:hover': {
      background: "rgba(0,0,0,0.1)",
    },
  },
  gray: {
    color: colors.darkGray,
  },
  totalCredits: {
    textAlign: 'right'
  }
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Keeper extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const keeperAsset = store.getStore('keeperAsset')
    const jobs = store.getStore('jobs').filter((job) => { return job.credits > 0 })
    const now = store.getStore('currentBlock')

    this.state = {
      loading: true,
      account: account,
      keeperAsset: keeperAsset,
      jobs: jobs,
      bondAmount: '',
      bondAmountError: false,
      removeBondAmount: '',
      removeBondAmountError: false,
      currentBlock: now
    }

    emitter.emit(START_LOADING, GET_KEEPER)
    emitter.emit(START_LOADING, GET_JOBS)
    emitter.emit(START_LOADING, GET_KEEPERS)
    emitter.emit(START_LOADING, GET_CURRENT_BLOCK)
    dispatcher.dispatch({ type: GET_KEEPER, content: {} })
    dispatcher.dispatch({ type: GET_JOBS, content: {} })
    dispatcher.dispatch({ type: GET_KEEPERS, content: {} })
    dispatcher.dispatch({ type: GET_CURRENT_BLOCK, content: { } })
  };

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(KEEPER_RETURNED, this.keeperProfileReturned)
    emitter.on(JOBS_RETURNED, this.jobsReturned);
    emitter.on(KEEPERS_RETURNED, this.keepersReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(ACCOUNT_CHANGED, this.connectionConnected);
    emitter.on(ADD_BOND_RETURNED, this.addBondReturned);
    emitter.on(REMOVE_BOND_RETURNED, this.removeBondReturned);
    emitter.on(ACTIVATE_BOND_RETURNED, this.activateBondReturned);
    emitter.on(WITHDRAW_BOND_RETURNED, this.withdrawBondReturned);
    emitter.on(CURRENT_BLOCK_RETURNED, this.currentBlockReturned);
  };

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(KEEPER_RETURNED, this.keeperProfileReturned)
    emitter.removeListener(JOBS_RETURNED, this.jobsReturned);
    emitter.removeListener(KEEPERS_RETURNED, this.keepersReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(ACCOUNT_CHANGED, this.connectionConnected);
    emitter.removeListener(ADD_BOND_RETURNED, this.addBondReturned);
    emitter.removeListener(REMOVE_BOND_RETURNED, this.removeBondReturned);
    emitter.removeListener(ACTIVATE_BOND_RETURNED, this.activateBondReturned);
    emitter.removeListener(WITHDRAW_BOND_RETURNED, this.withdrawBondReturned);
    emitter.removeListener(CURRENT_BLOCK_RETURNED, this.currentBlockReturned);
  };

  connectionConnected = () => {
    emitter.emit(START_LOADING, GET_KEEPER)
    emitter.emit(START_LOADING, GET_JOBS)
    emitter.emit(START_LOADING, GET_KEEPERS)
    emitter.emit(START_LOADING, GET_CURRENT_BLOCK)

    dispatcher.dispatch({ type: GET_KEEPER, content: {} })
    dispatcher.dispatch({ type: GET_JOBS, content: {} })
    dispatcher.dispatch({ type: GET_KEEPERS, content: {} })
    dispatcher.dispatch({ type: GET_CURRENT_BLOCK, content: { } })
  }

  errorReturned = (source) => {
    emitter.emit(STOP_LOADING, source)
    this.setState({ loading: false })
  };

  keeperProfileReturned = () => {
    emitter.emit(STOP_LOADING, GET_KEEPERS)

    console.log(store.getStore('keeperAsset'))

    this.setState({
      keeperAsset: store.getStore('keeperAsset'),
      loading: false
    })
  }

  jobsReturned = () => {
    emitter.emit(STOP_LOADING, GET_JOBS)
    this.setState({ jobs: store.getStore('jobs').filter((job) => { return job.credits > 0 }) })
  }

  keepersReturned = () => {
    emitter.emit(STOP_LOADING, GET_KEEPERS)
    this.setState({ keepers: store.getStore('keepers') })
  }

  addBondReturned = () => {
    this.setState({
      loading: false,
      onBond: false,
    })
    emitter.emit(STOP_LOADING, ADD_BOND)
  }

  removeBondReturned = () => {
    this.setState({
      loading: false,
      onBondRemove: false,
    })
    emitter.emit(STOP_LOADING, REMOVE_BOND)
  }

  activateBondReturned = () => {
    this.setState({
      loading: false,
    })
    emitter.emit(STOP_LOADING, ACTIVATE_BOND_RETURNED)
  }

  withdrawBondReturned = () => {
    this.setState({
      loading: false,
    })
    emitter.emit(STOP_LOADING, WITHDRAW_BOND)
  }

  currentBlockReturned = () => {
    emitter.emit(STOP_LOADING, GET_CURRENT_BLOCK)
    this.setState({ currentBlock: store.getStore('currentBlock') })
  }

  render() {
    const { classes } = this.props;
    const {
      loading,
      keeperAsset,
      keepers,
      onBond,
      onBondRemove,
      currentBlock,
      searchKeeper,
      searchKeeperError,
    } = this.state

    // var delegates = 'Self';
    // if (keeperAsset.delegates && keeperAsset.delegates !== '0x0000000000000000000000000000000000000000') {
    //   delegates = keeperAsset.delegates.substring(0,6)+'...'+keeperAsset.delegates.substring(keeperAsset.delegates.length-4,keeperAsset.delegates.length)
    // }

    return (
      <div className={ classes.root }>
        <div className={ classes.keeperLayout }>
          <div className={ classes.profileContainer }>
            <Typography variant='h3' className={ classes.title }>Profile</Typography>
            <div className={ classes.valueContainer }>
              <Typography variant='h4' className={ classes.valueTitle }>Balance</Typography>
              <Typography variant='h3' className={ classes.valueValue }> { keeperAsset.balance ? keeperAsset.balance.toFixed(2) : '0.00' } { keeperAsset.symbol } </Typography>
            </div>
            <div className={ classes.valueContainer }>
              <Typography variant='h4' className={ classes.valueTitle }>Bonds</Typography>
              { (!onBond && !onBondRemove) && this.renderBond() }
              { onBond && this.renderBondAdd() }
              { onBondRemove && this.renderBondRemove() }
            </div>
            { this.renderPendingBonds() }
            { this.renderActivateBonds() }
            { this.renderPendingUnbonds() }
            { this.renderWithdrawBonds() }
            { this.renderWorkCompleted() }
            { this.renderFirstSeen() }
            { this.renderSearch() }
            { /* <div className={ classes.valueContainer }>
              <Typography variant='h4' className={ classes.valueTitle }> Delegated</Typography>
              <div className={ classes.valueAction }>
                <Typography variant='h3' className={ classes.valueValue }> { delegates } </Typography>
                <Button
                  variant='text'
                  color='primary'
                >
                  Change
                </Button>
              </div>
            </div> */}
          </div>
          <div className={ classes.jobsContainer }>
            <div className={ classes.title }>
              <Typography variant='h3'>Jobs</Typography>
              <Button
                variant='contained'
                size='small'
                color='primary'
                onClick={ this.onAddJob }
              >
                add
              </Button>
            </div>
            { this.renderJobs() }
          </div>
        </div>
      </div>
    )
  }

  renderSearch = () => {
    const { classes } = this.props
    const { loading, searchKeeper, searchKeeperError } = this.state

    return (
      <div className={ classes.valueContainer }>
        <Typography variant='h4' className={ classes.valueTitle }>Find keep3r</Typography>
        <TextField
          fullWidth
          disabled={ loading }
          className={ classes.actionInput }
          id={ 'searchKeeper' }
          value={ searchKeeper }
          error={ searchKeeperError }
          onChange={ this.onSearchChange }
          placeholder="0x....."
          variant="outlined"
          onKeyDown= { this.onSearchKeyDown }
          InputProps={{
            endAdornment: <InputAdornment position="end" className={ classes.searchInputAdornment } onClick={ this.onSearch }><SearchIcon /></InputAdornment>,
          }}
        />
      </div>
    )
  }

  renderJobs = () => {
    const { classes } = this.props
    const { jobs, keeperAsset } = this.state

    if(jobs.length === 0) {
      return <div>
        <Typography variant='h4'>There are no jobs</Typography>
      </div>
    }

    return jobs.map((job) => {

      var address = null;
      if (job.address) {
        address = job.address.substring(0,6)+'...'+job.address.substring(job.address.length-4,job.address.length)
      }

      return <div onClick={ () => { this.navJob(job.address) } } className={ classes.jobContainer } key={ job.address }>
        <div>
          <Typography variant='h4'>{ job._name }</Typography>
          <Typography variant='h4' className={ classes.gray }>{ address }</Typography>
        </div>
        <div className={ classes.totalCredits }>
          <Typography variant='h4'>{ job.credits ? job.credits.toFixed(2) : '0.00' } { keeperAsset ? keeperAsset.symbol : '' }</Typography>
          <Typography variant='h4' className={ classes.gray }>Total Credits</Typography>
        </div>
      </div>
    })
  }

  renderFirstSeen = () => {
    const { classes } = this.props
    const { keeperAsset } = this.state

    if(keeperAsset.isActive) {
      return (
        <React.Fragment>
          <div className={ classes.valueContainer }>
            <Typography variant='h4' className={ classes.valueTitle }>First Seen</Typography>
            <Typography variant='h3' className={ classes.valueValue }> { moment(keeperAsset.firstSeen*1000).format("YYYY/MM/DD kk:mm") }</Typography>
          </div>
          <div className={ classes.valueContainer }>
            <Typography variant='h4' className={ classes.valueTitle }>Last Job</Typography>
            <Typography variant='h3' className={ classes.valueValue }> { moment(keeperAsset.lastJob*1000).format("YYYY/MM/DD kk:mm") }</Typography>
          </div>
        </React.Fragment>
      )
    } else {
      return null
    }
  }

  renderWorkCompleted = () => {
    const { classes } = this.props
    const { keeperAsset } = this.state

    return (
      <div className={ classes.valueContainer }>
        <Typography variant='h4' className={ classes.valueTitle }>Work Completed</Typography>
        <Typography variant='h3' className={ classes.valueValue }>{ keeperAsset.workCompleted ? keeperAsset.workCompleted.toFixed(4) : '0' }</Typography>
      </div>
    )

  }

  renderBond = () => {
    const { classes } = this.props
    const {
      keeperAsset,
    } = this.state

    return (
      <div className={ classes.valueActionBonds }>
        <Typography variant='h3' className={ classes.valueValue }> { keeperAsset.bonds ? keeperAsset.bonds.toFixed(2) : '0.00' } { keeperAsset.symbol } </Typography>
        <div className={ classes.valueActionBondsAction }>
          <Button
            size='small'
            variant='contained'
            color='primary'
            onClick={ this.onBondAdd }
          >
            Bond
          </Button>
          <Button
            size='small'
            variant='contained'
            color='primary'
            onClick={ this.onBondRemove }
          >
            Unbond
          </Button>
        </div>
      </div>
    )
  }

  renderPendingBonds = () => {
    const { classes } = this.props
    const {
      keeperAsset,
    } = this.state

    if(keeperAsset.isActive && keeperAsset.pendingBonds === 0) {
      return null
    } else if(parseInt(keeperAsset.bondings) > 0) {
      return (
        <div className={ classes.valueContainer }>
          <Typography variant='h4' className={ classes.valueTitle }>Bonds pending</Typography>
          <div className={ classes.valueAction }>
            <Typography variant='h3' className={ classes.valueValue }> { keeperAsset.pendingBonds ? keeperAsset.pendingBonds.toFixed(2) : '0.00' } { keeperAsset.symbol } </Typography>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  renderActivateBonds = () => {
    const { classes } = this.props
    const {
      keeperAsset,
    } = this.state

    if(keeperAsset.isActive && keeperAsset.pendingBonds === 0) {
      return null
    } else if(parseInt(keeperAsset.bondings) > 0 && moment(keeperAsset.bondings*1000).valueOf() < moment().valueOf()) {
      return (
        <div className={ classes.valueContainer }>
          <Typography variant='h4' className={ classes.valueTitle }>Activate</Typography>
          <Button
            variant='contained'
            size='small'
            color='primary'
            onClick={ this.onActivate }
          >
            Activate Bonds
          </Button>
        </div>
      )
    } else if (keeperAsset.bondings > 0) {
      return (
        <div className={ classes.valueContainer }>
          <Typography variant='h4' className={ classes.valueTitle }>Activatable at</Typography>
          <div className={ classes.valueAction }>
            <Typography variant='h3' className={ classes.valueValue }> { moment(keeperAsset.bondings*1000).format("YYYY/MM/DD kk:mm") } </Typography>
          </div>
        </div>
      )
    }
  }

  renderPendingUnbonds = () => {
    const { classes } = this.props
    const {
      keeperAsset,
    } = this.state

    if(parseInt(keeperAsset.unbondings) > 0) {
      return (
        <div className={ classes.valueContainer }>
          <Typography variant='h4' className={ classes.valueTitle }>Unbonds pending</Typography>
          <div className={ classes.valueAction }>
            <Typography variant='h3' className={ classes.valueValue }> { keeperAsset.partialUnbonding ? keeperAsset.partialUnbonding.toFixed(2) : '0.00' } { keeperAsset.symbol } </Typography>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  renderWithdrawBonds = () => {
    const { classes } = this.props
    const {
      keeperAsset,
      withdrawBondAmount,
      withdrawBondAmountError,
      loading
    } = this.state

    if(parseInt(keeperAsset.unbondings) > 0 && moment(keeperAsset.unbondings*1000).valueOf() < moment().valueOf()) {
      return (
        <div>
          <div className={ classes.valueActionButtons }>
            <Button
              variant='contained'
              size='small'
              color='primary'
              onClick={ this.onWithdraw }
            >
              withdraw
            </Button>
          </div>
        </div>
      )
    } else if (keeperAsset.unbondings > 0) {
      return (
        <div className={ classes.valueContainer }>
          <Typography variant='h4' className={ classes.valueTitle }>Withdrawable at</Typography>
          <div className={ classes.valueAction }>
            <Typography variant='h3' className={ classes.valueValue }> { moment(keeperAsset.unbondings*1000).format("YYYY/MM/DD kk:mm") } </Typography>
          </div>
        </div>
      )
    }
  }

  renderBondAdd = () => {
    const { classes } = this.props
    const {
      keeperAsset,
      bondAmount,
      bondAmountError,
      loading
    } = this.state

    return (
      <div>
        <div className={ classes.inputContainer }>
          <Typography variant='h6' className={ classes.balance } onClick={ () => { this.maxClicked('bond') } }>{ keeperAsset.balance.toFixed(4) } { keeperAsset.symbol }</Typography>
          <TextField
            fullwidth
            disabled={ loading }
            id='bondAmount'
            variant='outlined'
            color='primary'
            className={ classes.textField }
            placeholder='Amount to bond'
            value={ bondAmount }
            error={ bondAmountError }
            onChange={ this.onChange }
            InputProps={{
              className: classes.inputField,
              startAdornment: <InputAdornment position="start" className={ classes.inputAdornment }>
                <img src={ require('../../assets/tokens/'+keeperAsset.logo) } width="30px" alt="" />
              </InputAdornment>
            }}
          />
        </div>
        <div className={ classes.valueActionButtons }>
          <Button
            variant='text'
            size='small'
            color='primary'
            onClick={ this.onBondAddClose }
          >
            cancel
          </Button>
          <Button
            variant='contained'
            size='small'
            color='primary'
            onClick={ this.onBond }
          >
            bond
          </Button>
        </div>
      </div>
    )
  }

  renderBondRemove = () => {
    const { classes } = this.props
    const {
      keeperAsset,
      removeBondAmount,
      removeBondAmountError,
      loading
    } = this.state

    return (
      <div>
        <div className={ classes.inputContainer }>
          <Typography variant='h6' className={ classes.balance } onClick={ () => { this.maxClicked('bondRemove') } }>{ keeperAsset.bonds.toFixed(4) } { keeperAsset.symbol }</Typography>
          <TextField
            fullwidth
            disabled={ loading }
            id='removeBondAmount'
            variant='outlined'
            color='primary'
            className={ classes.textField }
            placeholder='Amount to unbond'
            value={ removeBondAmount }
            error={ removeBondAmountError }
            onChange={ this.onChange }
            InputProps={{
              className: classes.inputField,
              startAdornment: <InputAdornment position="start" className={ classes.inputAdornment }>
                <img src={ require('../../assets/tokens/'+keeperAsset.logo) } width="30px" alt="" />
              </InputAdornment>
            }}
          />
        </div>
        <div className={ classes.valueActionButtons }>
          <Button
            variant='text'
            size='small'
            color='primary'
            onClick={ this.onBondRemoveClose }
          >
            cancel
          </Button>
          <Button
            variant='contained'
            size='small'
            color='primary'
            onClick={ this.onCallBondRemove }
          >
            unbond
          </Button>
        </div>
      </div>
    )
  }

  maxClicked = (type) => {
    const {
      keeperAsset
    } = this.state

    switch (type) {
      case 'bond':
        this.setState({ bondAmount: keeperAsset.balance })
        break;
      case 'bondRemove':
        this.setState({ removeBondAmount: keeperAsset.bonds })
        break;
      case 'bondWithdraw':
        this.setState({ withdrawBondAmount: keeperAsset.bonds })
        break;
      default:
    }
  }

  onSearchChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onSearchKeyDown = (event) => {
    if (event.which === 13) {
      this.onSearch();
    }
  }

  onSearch = () => {
    this.setState({ searchKeeperError: false })
    const {
      searchKeeper
    } = this.state

    let error = false

    if(!searchKeeper || searchKeeper === "") {
      this.setState({ searchKeeperError: 'Invalid' })
      error = true
    }

    if(!error) {
      this.props.history.push('/keep3r/'+searchKeeper)
    }
  }

  onChange = (event) => {
    if(event.target.value !== '' && isNaN(event.target.value)) {
      return false
    }

    const { keeperAsset } = this.state
    if(event.target.id === 'bondAmount' && event.target.value > keeperAsset.balance) {
      event.target.value = keeperAsset.balance
    }
    if(event.target.id === 'removeBondAmount' && event.target.value > keeperAsset.bonds) {
      event.target.value = keeperAsset.bonds
    }

    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onBond = () => {
    this.setState({ bondAmountError: false })
    const { keeperAsset, bondAmount } = this.state

    let error = false

    if(bondAmount > keeperAsset.balance) {
      error = true
      this.setState({ bondAmountError: 'Amount > balance' })
    }

    if(!error) {
      emitter.emit(START_LOADING, ADD_BOND)
      this.setState({ loading: true })
      dispatcher.dispatch({ type: ADD_BOND, content: { amount: bondAmount } })
    }
  }

  onWithdraw = () => {
      emitter.emit(START_LOADING, WITHDRAW_BOND);
      this.setState({ loading: true });
      dispatcher.dispatch({ type: WITHDRAW_BOND});
  };

  onCallBondRemove = () => {
    this.setState({ bondAmountError: false })
    const { keeperAsset, removeBondAmount } = this.state

    let error = false

    if(removeBondAmount > keeperAsset.bonds) {
      error = true
      this.setState({ removeBondAmountError: 'Amount > bonded balance' })
    }

    if(!error) {
      emitter.emit(START_LOADING, REMOVE_BOND)
      this.setState({ loading: true })
      dispatcher.dispatch({ type: REMOVE_BOND, content: { amount: removeBondAmount } })
    }
  }

  onBondAdd = () => {
    this.setState({ onBond: true })
  }

  onBondAddClose = () => {
    this.setState({ onBond: false })
  }

  onBondRemove = () => {
    this.setState({ onBondRemove: true })
  }

  onBondRemoveClose = () => {
    this.setState({ onBondRemove: false })
  }

  onActivate = () => {
    emitter.emit(START_LOADING, ACTIVATE_BOND)
    this.setState({ loading: true })
    dispatcher.dispatch({ type: ACTIVATE_BOND, content: { } })
  }

  onAddJob = () => {
    this.props.history.push('/keep3r/job')
  }

  navJob = (address) => {
    this.props.history.push('/keep3r/job/'+address)
  }
}

export default withRouter(withStyles(styles)(Keeper));
