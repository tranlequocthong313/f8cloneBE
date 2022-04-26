const mailHTML = (changes) => {
  return `
    <div>
      <image src="https://static.fullstack.edu.vn/static/media/f8-icon.7ad2b161d5e80c87e516.png" style="clear: both;display: block;float: none;margin: 0 auto;max-width: 100%;outline: 0;text-align: center;text-decoration: none;width: 44px;"/>
      <h3 style="text-align: center;color: inherit;font-family: Helvetica,Arial,sans-serif;font-size: 28px;font-weight: 600;line-height: 1.3;margin: 16px 0 32px 0;padding: 0;text-align: center;word-wrap: normal;" inherit;="" font-family:="" helvetica,arial,sans-serif;="" font-size:="" 28px;="" font-weight:="" 600;="" line-height:="" 1.3;="" margin:="" 16px="" 0="" 32px="" 0;="" padding:="" text-align:="" center;="" word-wrap:="" normal;="">${
        changes.option === 'signUp'
          ? 'Mã xác minh tại F8'
          : 'Mã khôi phục mật khẩu'
      }</h3>
      <p style="color: #0a0a0a;font-family: Helvetica,Arial,sans-serif;font-size: 14px;font-weight: 400;line-height: 24px;margin: 0;margin-bottom: 10px;padding: 0;text-align: left;" #0a0a0a;="" font-family:="" helvetica,arial,sans-serif;="" font-size:="" 14px;="" font-weight:="" 400;="" line-height:="" 24px;="" margin:="" 0;="" margin-bottom:="" 10px;="" padding:="" text-align:="" left;="">${
        changes.option === 'signUp'
          ? 'Để xác minh tài khoản của bạn, hãy nhập mã này vào F8:'
          : 'Bạn nhận được emaill này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.'
      }</p>
      <div style="margin-bottom: 16px;background-color: #ebebeb;color: #333;font-size: 40px;letter-spacing: 8px;padding: 16px;text-align: center;" #ebebeb;="" color:="" #333;="" font-size:="" 40px;="" letter-spacing:="" 8px;="" padding:="" 16px;="" text-align:="" center;="">${
        changes.otp
      }</div>
      <p style="color: #0a0a0a;font-family: Helvetica,Arial,sans-serif;font-size: 14px;font-weight: 400;line-height: 24px;margin: 0;margin-bottom: 10px;padding: 0;text-align: left;" #0a0a0a;="" font-family:="" helvetica,arial,sans-serif;="" font-size:="" 14px;="" font-weight:="" 400;="" line-height:="" 24px;="" margin:="" 0;="" margin-bottom:="" 10px;="" padding:="" text-align:="" left;="">
      Mã xác minh sẽ hết hạn sau 48 giờ.</p>
      <p style="color: #0a0a0a;font-family: Helvetica,Arial,sans-serif;font-size: 14px;font-weight: 400;line-height: 24px;margin: 0;margin-bottom: 10px;padding: 0;text-align: left;" #0a0a0a;="" font-family:="" helvetica,arial,sans-serif;="" font-size:="" 14px;="" font-weight:="" 400;="" line-height:="" 24px;="" margin:="" 0;="" margin-bottom:="" 10px;="" padding:="" text-align:="" left;=""><b>Nếu bạn không yêu cầu mã, </b>
      bạn có thể bỏ qua tin nhắn này.</p>
      <p style="color: #0a0a0a;font-family: Helvetica,Arial,sans-serif;font-size: 14px;font-weight: 400;line-height: 24px;margin: 0;margin-bottom: 10px;padding: 0;text-align: left;" #0a0a0a;="" font-family:="" helvetica,arial,sans-serif;="" font-size:="" 14px;="" font-weight:="" 400;="" line-height:="" 24px;="" margin:="" 0;="" margin-bottom:="" 10px;="" padding:="" text-align:="" left;="">Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào hãy liên hệ với chúng tôi qua hòm thư 
      <a href="mailto:contact@fullstack.edu.vn" target="_blank" rel="noopener noreferrer" style="color: #00aa9d;font-family: Helvetica,Arial,sans-serif;font-weight: 400;line-height: 1.3;margin: 0;padding: 0;text-align: left;text-decoration: none;" #00aa9d;="" font-family:="" helvetica,arial,sans-serif;="" font-weight:="" 400;="" line-height:="" 1.3;="" margin:="" 0;="" padding:="" text-align:="" left;="" text-decoration:="" none;=""> contact@fullstack.edu.vn</a></p>
      <p style="color: #0a0a0a;font-family: Helvetica,Arial,sans-serif;font-size: 14px;font-weight: 400;line-height: 24px;margin: 0;margin-bottom: 10px;padding: 0;text-align: left;" #0a0a0a;="" font-family:="" helvetica,arial,sans-serif;="" font-size:="" 14px;="" font-weight:="" 400;="" line-height:="" 24px;="" margin:="" 0;="" margin-bottom:="" 10px;="" padding:="" text-align:="" left;="">Trân trọng,</p>
      <p style="color: #0a0a0a;font-family: Helvetica,Arial,sans-serif;font-size: 14px;font-weight: 400;line-height: 24px;margin: 0;margin-bottom: 10px;padding: 0;text-align: left;" #0a0a0a;="" font-family:="" helvetica,arial,sans-serif;="" font-size:="" 14px;="" font-weight:="" 400;="" line-height:="" 24px;="" margin:="" 0;="" margin-bottom:="" 10px;="" padding:="" text-align:="" left;="">Đội ngũ phát triển <a href="https://fullstack.edu.vn/" target="_blank" rel="noopener noreferrer">fullstackclone.edu.vn</a></p>
      <p style="font-family: ;font-family: Helvetica,Arial,sans-serif;font-size: 14px;font-weight: 400;line-height: 24px;margin: 0;margin-bottom: 10px;padding: 0;text-align: left;color: #757575;" helvetica,arial,sans-serif;="" font-size:="" 14px;="" font-weight:="" 400;="" line-height:="" 24px;="" margin:="" 0;="" margin-bottom:="" 10px;="" padding:="" text-align:="" left;="" color:="" #757575;=""><i>Đây là email được tạo tự động. Vui lòng không trả lời thư này.</i></p>
    </div>`
}

module.exports = mailHTML
