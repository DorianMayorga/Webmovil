// Configuración de Supabase
const supabaseUrl = 'https://xazcqnlstuyqqzckhtsq.supabase.co'; // Reemplaza con tu URL
const supabaseKey = 'sb_publishable_wYFgxaf32ne7uTGnBuucyQ_TpH6miU_'; // Reemplaza con tu clave
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);



// Cargar datos cuando la página se abra
document.addEventListener('DOMContentLoaded', loadData);

// Manejar el formulario
document.getElementById('data-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Validar campos requeridos
    if (!name || !email) {
        alert('Por favor, completa al menos el nombre y email');
        return;
    }
    
    // Mostrar mensaje de carga
    const button = e.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Guardando...';
    button.disabled = true;
    
    // Insertar datos en Supabase
    const { data, error } = await supabaseClient
        .from('messages')
        .insert([{ 
            name: name.trim(), 
            email: email.trim(), 
            message: message.trim() 
        }]);
    
    if (error) {
        console.error('Error de Supabase:', error);
        alert('Error al guardar: ' + error.message);
    } else {
        alert('¡Datos guardados correctamente en la nube!');
        document.getElementById('data-form').reset();
        loadData(); // Recargar la lista
    }
    
    // Restaurar botón
    button.textContent = originalText;
    button.disabled = false;
});

// Función para cargar y mostrar datos
async function loadData() {
    const dataList = document.getElementById('data-list');
    
    // Mostrar mensaje de carga
    dataList.innerHTML = '<p>Cargando datos de la base de datos...</p>';
    
    try {
        const { data, error } = await supabaseClient
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        if (!data || data.length === 0) {
            dataList.innerHTML = '<p>No hay mensajes guardados todavía. ¡Sé el primero!</p>';
            return;
        }
        
        const html = data.map(item => `
            <div class="data-item">
                <h3>${escapeHtml(item.name)}</h3>
                <p><strong>Email:</strong> ${escapeHtml(item.email)}</p>
                <p>${item.message ? escapeHtml(item.message) : '<em>(Sin mensaje)</em>'}</p>
                <small>${formatDate(item.created_at)}</small>
            </div>
        `).join('');
        
        dataList.innerHTML = html;
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        dataList.innerHTML = `
            <div class="error">
                <p>Error al cargar datos: ${error.message}</p>
                <p>Verifica tu conexión a internet</p>
            </div>
        `;
    }
}

// Función para formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para prevenir XSS (seguridad básica)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Probar conexión con Supabase al cargar
window.addEventListener('load', async () => {
    console.log('Probando conexión con Supabase...');
    
    try {
        const { data, error } = await supabaseClient
            .from('messages')
            .select('id')
            .limit(1);
        
        if (error) {
            console.error('❌ Error de conexión con Supabase:', error.message);
            console.log('💡 Verifica:');
            console.log('1. Tu URL de Supabase:', supabaseUrl);
            console.log('2. Que la tabla "messages" exista en Supabase');
            console.log('3. Que tu clave tenga permisos correctos');
        } else {
            console.log('✅ Conexión exitosa con Supabase!');
        }
    } catch (error) {
        console.error('❌ Error inesperado:', error);
    }
});