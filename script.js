// Configuración de Supabase
const supabaseUrl = 'xazcqnlstuyqqzckhtsq'; // Reemplaza con tu URL
const supabaseKey = 'Oneofus1998xlr8'; // Reemplaza con tu clave
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Incluye esta línea en tu HTML antes de este script:
// <script src="https://unpkg.com/@supabase/supabase-js@2"></script>

// Cargar datos cuando la página se abra
document.addEventListener('DOMContentLoaded', loadData);

// Manejar el formulario
document.getElementById('data-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Insertar datos en Supabase
    const { data, error } = await supabaseClient
        .from('messages')
        .insert([{ name, email, message }]);
    
    if (error) {
        alert('Error al guardar: ' + error.message);
    } else {
        alert('¡Datos guardados correctamente!');
        document.getElementById('data-form').reset();
        loadData();
    }
});

// Función para cargar y mostrar datos
async function loadData() {
    const { data, error } = await supabaseClient
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        document.getElementById('data-list').innerHTML = 
            '<p class="error">Error al cargar datos</p>';
        return;
    }
    
    if (data.length === 0) {
        document.getElementById('data-list').innerHTML = 
            '<p>No hay datos guardados todavía</p>';
        return;
    }
    
    const html = data.map(item => `
        <div class="data-item">
            <h3>${item.name}</h3>
            <p><strong>Email:</strong> ${item.email}</p>
            <p>${item.message}</p>
            <small>${new Date(item.created_at).toLocaleDateString()}</small>
        </div>
    `).join('');
    
    document.getElementById('data-list').innerHTML = html;
}