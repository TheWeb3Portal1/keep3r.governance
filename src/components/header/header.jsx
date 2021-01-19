import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme'

import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  ACCOUNT_CHANGED,
  GET_BALANCES,
  BALANCES_RETURNED,
  GET_GAS_PRICES,
  GAS_PRICES_RETURNED,
  START_LOADING,
  STOP_LOADING
} from '../../constants'

import Account from '../account';
import Currencies from '../currencies';

import Store from "../../stores";
const emitter = Store.emitter
const store = Store.store
const dispatcher = Store.dispatcher

const styles = theme => ({
  root: {
    verticalAlign: 'top',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '0px'
    }
  },
  headerV2: {
    background: colors.white,
    borderBottom: '1px solid '+colors.borderBlue,
    width: '100%',
    borderRadius: '0px',
    display: 'flex',
    padding: '24px 32px',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-evenly',
      padding: '16px 24px'
    }
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  placeholderIcon: {
    maxWidth: '0px',
    height: '37px',
    [theme.breakpoints.down('sm')]: {
      minWidth: '25px'
    }
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  link: {
    padding: '12px 0px',
    margin: '0px 12px',
    cursor: 'pointer',
    borderBottom: "3px solid "+colors.white,
    '&:hover': {
      borderBottom: "3px solid "+colors.borderBlue,
    },
  },
  title: {
    textTransform: 'capitalize'
  },
  linkActive: {
    padding: '12px 0px',
    margin: '0px 12px',
    cursor: 'pointer',
    borderBottom: "3px solid "+colors.borderBlue,
  },
  account: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  walletAddress: {
    padding: '12px',
    border: '2px solid rgb(174, 174, 174)',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      border: "2px solid "+colors.borderBlue,
      background: 'rgba(47, 128, 237, 0.1)'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      justifyContent: 'center',
      color: colors.white,
      background: colors.blue,
      padding: '20px',
      borderRadius: '40px 40px 0 0',
      border: "1px solid "+colors.borderBlue,
      '&:hover': {
        background: colors.lightGray,
        color: colors.black,
      }
    }
  },
  name: {
    paddingLeft: '24px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  },
  accountDetailsSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'space-evenly',
      zIndex: 100,
      color: colors.white,
      background: colors.blue,
      padding: '20px 30px 20px 30px',
      borderRadius: '40px 40px 0 0',
      border: "1px solid "+colors.borderBlue,
      '&:active': {
        color: colors.black,
      }
    },
  },
  accountDetailsAddress: {
    color: colors.background,
    fontWeight: 'bold',
    padding: '0px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      textDecoration: 'underline'
    },
    [theme.breakpoints.down('sm')]: {
      color: colors.black,
      background: colors.white,
      fontWeight: 'bold',
      padding: '0px 12px',
      height: '30px',
      borderRadius: '30px'
    }
  },
  accountDetailsBalance: {
    color: colors.background,
    fontWeight: 'bold',
    padding: '0px 12px',
    borderRight: '2px solid '+colors.text,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      padding: '0px 6px',
      color: colors.black,
      background: colors.white,
      borderRight: '0',
      fontWeight: 'bold',
      // padding: '0px 12px',
      height: '30px',
      borderRadius: '5px'
    },
  },
  connectedDot: {
    borderRadius: '100px',
    border: '8px solid '+colors.green,
    marginLeft: '12px'
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    lineHeight: '1.2',
    background: colors.white,
    marginTop: '40px'
  }
});

class Header extends Component {

  constructor(props) {
    super()

    this.state = {
      account: store.getStore('account'),
      gasPrices: store.getStore('gasPrices'),
      rewardAsset: store.getStore('rewardAsset'),
      currenciesAnchorEl: null,
      accountAnchorEl: null
    }
  }

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(ACCOUNT_CHANGED, this.connectionConnected);
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
    emitter.on(GAS_PRICES_RETURNED, this.gasPricesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(ACCOUNT_CHANGED, this.connectionConnected);
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(GAS_PRICES_RETURNED, this.gasPricesReturned);
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })

    emitter.emit(START_LOADING, GET_BALANCES)

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    dispatcher.dispatch({ type: GET_GAS_PRICES, content: {} })
  }

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  balancesReturned = () => {
    this.setState({
      rewardAsset: store.getStore('rewardAsset'),
      keeperAsset: store.getStore('keeperAsset')
    })
  }

  gasPricesReturned = () => {
    emitter.emit(STOP_LOADING, GET_GAS_PRICES)
    this.setState({ gasPrices: store.getStore('gasPrices') })
  }

  render() {
    const {
      classes
    } = this.props;

    const {
      account,
      accountAnchorEl,
      currenciesAnchorEl,
    } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.headerV2 }>
          <div className={ classes.icon }>
            <img
              alt=""
              src={ require('../../assets/logo.svg') }
              height={ '37px' }
              onClick={ () => { this.nav('') } }
            />
            <Typography variant={ 'h3'} className={ classes.name } onClick={ () => { this.nav('') } }>keep3r.network</Typography>
          </div>
          <div className={ classes.links }>
            { this.renderLink('keep3r') }
            { this.renderLink('governance') }
          </div>
          <div className={ classes.account }>
            { !account.address &&
              <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap onClick={this.connectWallet} >
                Connect wallet
              </Typography>
            }
            { account.address &&
              this.renderAccountInformation()
            }
            { accountAnchorEl && this.renderAccount() }
            { currenciesAnchorEl && this.renderCurrencies() }
          </div>
          <div className={classes.placeholderIcon}/>
        </div>
        <Typography variant={'h5'} className={ classes.disclaimer }>This project is in beta. Use at your own risk.</Typography>
      </div>
    )
  }

  renderAccountInformation = () => {
    const { classes } = this.props
    const { account, keeperAsset } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.accountDetailsSection }>
        <Typography className={ classes.accountDetailsBalance } variant='h4'>{ (keeperAsset && keeperAsset.balance) ? keeperAsset.balance.toFixed(2) : '0' } { keeperAsset ? keeperAsset.symbol : '' }</Typography>
        <Typography className={ classes.accountDetailsBalance } onClick={ this.currencyClicked } variant='h4'>{ (keeperAsset && keeperAsset.currentVotes && keeperAsset.currentVotes > 0) ? parseFloat(keeperAsset.currentVotes).toFixed(2) : '0' } { keeperAsset ? keeperAsset.voteSymbol : '' }</Typography>
        <Typography className={ classes.accountDetailsAddress } onClick={ this.addressClicked } variant='h4'>{ address } <div className={ classes.connectedDot }></div></Typography>
      </div>
    )
  }

  currencyClicked = (e) => {
    const { currenciesAnchorEl } = this.state
    this.setState({ currenciesAnchorEl: currenciesAnchorEl ? null : e.target, accountAnchorEl: null })
  }

  addressClicked = (e) => {
    const { accountAnchorEl } = this.state
    this.setState({ accountAnchorEl: accountAnchorEl ? null : e.target, currenciesAnchorEl: null })
  }

  closeCurrenciesMenu = () => {
    this.setState({ currenciesAnchorEl: null })
  }

  closeAccountMenu = () => {
    this.setState({ accountAnchorEl: null })
  }

  renderCurrencies = () => {
    return (
      <Currencies anchorEl={ this.state.currenciesAnchorEl } handleClose={ this.closeCurrenciesMenu }  />
    )
  }

  renderAccount = () => {
    return (
      <Account anchorEl={ this.state.accountAnchorEl } handleClose={ this.closeAccountMenu }  />
    )
  }

  nav = (screen) => {
    this.props.history.push('/'+screen)
  }

  connectWallet = () => {
    const connectors = store.getStore('connectorsByName')
    const injected = connectors[0].connector

    injected.activate()
    .then((a) => {
      store.setStore({ account: { address: a.account }, web3context: { library: { provider: a.provider } } })
      emitter.emit(CONNECTION_CONNECTED)
    })
    .catch((e) => {
      console.log(e)
    })
  }

  renderLink = (screen) => {
    const {
      classes
    } = this.props;

    return (
      <div className={ (window.location.pathname.includes(screen) || (screen==='keep3r' && window.location.pathname==='/')  )?classes.linkActive:classes.link } onClick={ () => { this.nav(screen) } }>
        <Typography variant={'h4'} className={ `title` }>{ screen }</Typography>
      </div>
    )
  }

  nav = (screen) => {
    if(screen === 'cover') {
      window.open("https://yinsure.finance", "_blank")
      return
    }
    this.props.history.push('/'+screen)
  }
}

export default withRouter(withStyles(styles)(Header));
