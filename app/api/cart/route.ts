import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

// Get cart items
export async function GET() {
  try {
    const session = await auth();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart_session')?.value || Math.random().toString(36).substring(7);

    let cart;

    if (session?.user?.id) {
      // User is logged in
      cart = await prisma.cart.findFirst({
        where: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    } else {
      // Guest user
      cart = await prisma.cart.findFirst({
        where: { sessionId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    const response = NextResponse.json({ 
      items: cart?.items || [],
      total: cart?.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0
    });

    // Set session cookie for guest users
    if (!session?.user?.id) {
      response.cookies.set('cart_session', sessionId, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }

    return response;

  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const session = await auth();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart_session')?.value || Math.random().toString(36).substring(7);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let cart;

    if (session?.user?.id) {
      // User is logged in
      cart = await prisma.cart.findFirst({
        where: { userId: session.user.id },
        include: { items: true }
      });
      
      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: session.user.id },
          include: { items: true }
        });
      }
    } else {
      // Guest user
      cart = await prisma.cart.findFirst({
        where: { sessionId },
        include: { items: true }
      });
      
      if (!cart) {
        cart = await prisma.cart.create({
          data: { sessionId },
          include: { items: true }
        });
      }
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }

    const response = NextResponse.json({ success: true });

    // Set session cookie for guest users
    if (!session?.user?.id) {
      response.cookies.set('cart_session', sessionId, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }

    return response;

  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

// Update item quantity
export async function PUT(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json();

    if (!itemId || quantity < 0) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: itemId }
      });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cart PUT error:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}