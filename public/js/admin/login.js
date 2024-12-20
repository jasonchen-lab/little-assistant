document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            console.log('Sending login request with:', { username: credentials.username });
            
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok && data.success) {
                window.location.href = '/admin/dashboard';
            } else {
                alert(data.message || '登录失败：用户名或密码错误');
            }
        } catch (error) {
            console.error('登录失败:', error);
            alert('登录失败：' + error.message);
        }
    });
}); 