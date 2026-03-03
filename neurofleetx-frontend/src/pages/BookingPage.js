import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingPage = () => {
    const [availableDrivers, setAvailableDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        customerName: '', customerPhone: '', pickupLocation: '',
        dropLocation: '', scheduledDate: '', vehicleId: ''
    });
    const [selectedDriver, setSelectedDriver] = useState(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/vehicles', {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setAvailableDrivers(res.data.filter(v => (v.status || "").toUpperCase() === "AVAILABLE"));
                setLoading(false);
            } catch (err) {
                console.error("Fetch error", err);
                setLoading(false);
            }
        };
        fetchDrivers();
    }, []);

    const handleDriverSelect = (driver) => {
        setBookingData({ ...bookingData, vehicleId: driver.id });
        setSelectedDriver(driver);
    };

    const handleInputChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bookingData.vehicleId) return alert("Please select a driver from the list!");

        try {
            const token = localStorage.getItem("token");
            await axios.post('http://localhost:8081/api/bookings', bookingData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✨ Booking Confirmed! Internal teams notified.");
            window.location.reload();
        } catch (err) {
            alert("Booking failed. Please check the details.");
        }
    };

    if (loading) return <div style={styles.loading}>SYNCING FLEET...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.inner}>
                <div style={styles.formCard}>
                    <header style={styles.header}>
                        <h1 style={styles.title}>Dispatch Center</h1>
                        <p style={styles.subtitle}>Create a new trip assignment</p>
                    </header>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Customer Name</label>
                                <input name="customerName" placeholder="Full Name" onChange={handleInputChange} style={styles.input} required />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Phone Number</label>
                                <input name="customerPhone" placeholder="+91..." onChange={handleInputChange} style={styles.input} required />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Pickup Location</label>
                            <input name="pickupLocation" placeholder="Enter pickup address" onChange={handleInputChange} style={styles.input} required />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Drop Location</label>
                            <input name="dropLocation" placeholder="Enter destination" onChange={handleInputChange} style={styles.input} required />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Scheduled Departure</label>
                            <input name="scheduledDate" type="datetime-local" onChange={handleInputChange} style={styles.input} required />
                        </div>

                        <button type="submit" style={styles.submitBtn}>
                            CONFIRM TRIP {selectedDriver ? `WITH ${selectedDriver.driverName.toUpperCase()}` : ""}
                        </button>
                    </form>
                </div>

                <div style={styles.driverList}>
                    <div style={styles.listHeader}>
                        <h3 style={{ margin: 0, color: '#0f172a' }}>Available Drivers</h3>
                        <span style={styles.badge}>{availableDrivers.length} Online</span>
                    </div>

                    <div style={styles.scrollContainer}>
                        {availableDrivers.map(d => (
                            <div
                                key={d.id}
                                onClick={() => handleDriverSelect(d)}
                                style={{
                                    ...styles.driverCard,
                                    border: bookingData.vehicleId === d.id ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                                    backgroundColor: bookingData.vehicleId === d.id ? '#f5f3ff' : 'white'
                                }}
                            >
                                <div style={styles.avatar}>{d.driverName.charAt(0)}</div>
                                <div style={styles.driverInfo}>
                                    <span style={styles.dName}>{d.driverName}</span>
                                    <span style={styles.vName}>{d.name} • #{d.id}</span>
                                </div>
                                {bookingData.vehicleId === d.id && <div style={styles.check}>✓</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: '57px',
        left: '240px',
        right: 0,
        bottom: 0,
        backgroundColor: '#f1f5f9',
        fontFamily: "'Inter', sans-serif",
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px',
        boxSizing: 'border-box',
    },
    inner: {
        display: 'flex',
        gap: '24px',
        width: '100%',
        maxWidth: '1100px',
        alignItems: 'flex-start',
    },
    formCard: {
        flex: '1',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column'
    },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 },
    subtitle: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputRow: { display: 'flex', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
    label: { fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' },
    input: {
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        fontSize: '15px',
        outline: 'none',
        transition: 'border 0.2s',
        backgroundColor: '#f8fafc'
    },
    submitBtn: {
        marginTop: '12px',
        backgroundColor: '#4f46e5',
        color: 'white',
        padding: '18px',
        borderRadius: '14px',
        border: 'none',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
        transition: 'all 0.3s ease'
    },
    driverList: {
        width: '340px',
        flexShrink: 0,
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column'
    },
    listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    badge: { backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' },
    scrollContainer: { display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' },
    driverCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative'
    },
    avatar: {
        width: '40px', height: '40px', backgroundColor: '#4f46e5', color: 'white',
        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', marginRight: '16px'
    },
    driverInfo: { display: 'flex', flexDirection: 'column' },
    dName: { fontWeight: '700', color: '#1e293b', fontSize: '15px' },
    vName: { fontSize: '12px', color: '#64748b' },
    check: { position: 'absolute', right: '16px', color: '#4f46e5', fontWeight: 'bold' },
    loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', letterSpacing: '2px', color: '#4f46e5' }
};

export default BookingPage;