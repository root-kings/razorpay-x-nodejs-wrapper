const axios = require('axios')

const {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  RAZORPAY_PAYOUT_ACCOUNT,
  RAZORPAY_PAYOUT_MODE,
  RAZORPAY_PAYOUT_QUEUE,
} = process.env

const BASE_URL = `https://${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}@api.razorpay.com/v1`

exports.createContact = ({ name, email, contact, type }) => {
  console.log(`[ RZPX ] Contact - Create`)
  return new Promise((resolve, reject) => {
    axios
      .post(BASE_URL + '/contacts', { name, email, contact, type })
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err.response.data)
      })
  })
}

exports.updateContact = (contact_id, { name, email, contact, type }) => {
  console.log(`[ RZPX ] Contact - Update`)
  return new Promise((resolve, reject) => {
    axios
      .patch(BASE_URL + '/contacts/' + contact_id, {
        name,
        email,
        contact,
        type,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err.response.data)
      })
  })
}

exports.createBankAccount = (contact_id, { name, account_number, ifsc }) => {
  console.log(`[ RZPX ] Account - Create`)
  return new Promise((resolve, reject) => {
    axios
      .post(BASE_URL + '/fund_accounts', {
        contact_id,
        account_type: 'bank_account',
        bank_account: {
          name,
          account_number,
          ifsc,
        },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err.response.data)
      })
  })
}

exports.createPayout = ({
  fund_account_id,
  amount,
  purpose,
  narration,
  idempotencyToken,
}) => {
  console.log(`[ RZPX ] Payout - Create`)
  return new Promise((resolve, reject) => {
    axios
      .post(
        BASE_URL + '/payouts',
        {
          account_number: RAZORPAY_PAYOUT_ACCOUNT,
          fund_account_id,
          amount,
          currency: 'INR',
          purpose,
          mode: RAZORPAY_PAYOUT_MODE,
          queue_if_low_balance: Boolean(RAZORPAY_PAYOUT_QUEUE),
          narration,
        },
        {
          headers: {
            'X-Payout-Idempotency': idempotencyToken,
          },
        }
      )
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err.response.data)
      })
  })
}
