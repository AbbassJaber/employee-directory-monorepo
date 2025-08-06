# Backend Architecture Decisions

This document explains the key architectural and design decisions made for the Employee Directory backend API.

## 🗄️ Database Design

### **Auto-Incrementing IDs**

- **Why**: Simple, efficient primary keys for internal company application
- **Benefits**:
    - Better performance (smaller indexes, faster joins)
    - Simpler debugging and data analysis
    - No need for UUID complexity in internal systems
    - Easier to work with in queries and relationships
- **Consideration**: Since this is an internal company application, there's no concern about ID enumeration attacks or exposing sequential IDs

### **Soft Deletes**

- **Why**: Preserve audit trail
- **Implementation**: `deactivatedAt` and `deactivatedBy` fields
- **Benefits**:
    - Data recovery capability
    - Audit trail maintenance

### **Versioning**

- **Why**: Maintain backward compatibility
- **Implementation**: URL versioning (`/api/v1/`)
- **Benefits**:
    - Safe API evolution
    - Backward compatibility
    - Clear version management

## 📁 File Upload

### **AWS S3 Integration & CloudFront CDN**

- **Why**: Fast global content delivery for uploaded files
- **Implementation**: Files are served through CloudFront distribution
- **Current Approach**: Using public CloudFront URLs (not signed/expiring)
- **Future Improvement**: Generate signed CloudFront URLs with expiration for enhanced security

## **Pagination**

- **Why**: Handle large datasets efficiently
- **Implementation**: server-side pagination
- **Benefits**:
    - Reduced memory usage
    - Faster response times
    - Better user experience

## 🔒 Security Considerations

### **JWT Security**

- **Why**: Secure token-based authentication
- **Implementation**:
    - Short-lived access tokens (15 minutes)
    - Long-lived refresh tokens (7 days)
    - Only refresh tokens are stored in database
- **Token Storage Strategy**:
    - Access tokens are not stored (short lifespan, no need to flood database)
    - Only refresh tokens are persisted (long lifespan, need for revocation)
    - Refresh tokens are UUIDs for security and uniqueness
    - Future enhancement: Blacklist table for revoked tokens with automatic cleanup
- **Benefits**:
    - Automatic token refresh
    - Secure token rotation
    - Minimal database overhead
